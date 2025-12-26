import { NextRequest, NextResponse } from 'next/server';
import { read, save } from 'soly-db';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';
const API_KEY_MIDDLE = process.env.API_KEY_MIDDLE || 'apikey';
const API_URL_MIDDLE = "https://www.middle-pay.com";

interface OrderData {
    id: string;
    userId: string;
    productId: string;
    type: 'premium' | 'topup_game' | 'social';
    reference?: string;
    transactionId?: string;
    state: 'pending' | 'completed' | 'failed' | 'processing' | 'confirming' | 'refunded';
    price: number;
    input?: {
        uid: string;
        [key: string]: string;
    };
    productMetadata?: {
        id: number;
        name: string;
        key: string;
        price: number;
        itemId: number;
        itemName: string;
        itemSku: string;
    };
    createdAt: string;
    updatedAt: string;
    finishedAt?: string;
    result_code?: number;
}

export async function POST(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                message: 'ไม่พบ token สำหรับการยืนยันตัวตน'
            }, { status: 401 });
        }

        const token = authHeader.substring(7);

        // Verify JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: 'Token ไม่ถูกต้อง'
            }, { status: 401 });
        }

        // Parse request body
        const { product_key, item_sku, input, webhookURL } = await request.json();

        // Validate request body
        if (!product_key || !item_sku || !input || !input.uid) {
            return NextResponse.json({
                success: false,
                message: 'กรุณาระบุข้อมูลให้ครบถ้วน (product_key, item_sku, input.uid)'
            }, { status: 400 });
        }

        // Find user
        const users = read('users.json') || [];
        const userIndex = users.findIndex((user: any) => user.id === decoded.id);

        if (userIndex === -1) {
            return NextResponse.json({
                success: false,
                message: 'ไม่พบข้อมูลผู้ใช้'
            }, { status: 404 });
        }

        const user = users[userIndex];
        const userBalance = user.balance || 0;

        // Get game details to check price
        let itemPrice = 0;
        let productName = '';
        let itemName = '';

        try {
            const gamesResponse = await axios.get(`${API_URL_MIDDLE}/api/v1/products/list`, {
                headers: {
                    'X-API-Key': API_KEY_MIDDLE
                }
            });

            const game = gamesResponse.data?.find((g: any) => g.key === product_key);
            if (!game) {
                return NextResponse.json({
                    success: false,
                    message: 'ไม่พบเกมที่ระบุ'
                }, { status: 404 });
            }

            const item = game.items?.find((i: any) => i.sku === item_sku);
            if (!item) {
                return NextResponse.json({
                    success: false,
                    message: 'ไม่พบไอเท็มที่ระบุ'
                }, { status: 404 });
            }

            itemPrice = parseFloat(item.price) || 0;
            productName = game.name || '';
            itemName = item.name || '';

            if (itemPrice <= 0) {
                return NextResponse.json({
                    success: false,
                    message: 'ราคาไอเท็มไม่ถูกต้อง'
                }, { status: 400 });
            }
        } catch (error) {
            console.error('Error fetching game details:', error);
            return NextResponse.json({
                success: false,
                message: 'ไม่สามารถตรวจสอบข้อมูลเกมได้'
            }, { status: 500 });
        }

        // Check if user has enough balance
        if (userBalance < itemPrice) {
            return NextResponse.json({
                success: false,
                message: 'ยอดเงินคงเหลือไม่เพียงพอ'
            }, { status: 400 });
        }

        // Create order record
        const orderId = uuidv4();
        const orderData: OrderData = {
            id: orderId,
            userId: decoded.id,
            productId: product_key,
            type: 'topup_game',
            state: 'processing',
            price: itemPrice,
            input: input,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save order to database
        const orders = read('orders.json') || [];
        orders.push(orderData);
        save('orders.json', orders);

        try {
            // Call external API to create order
            const externalResponse = await axios.post(`${API_URL_MIDDLE}/api/v1/agent/orders/create`, {
                product_key: product_key,
                item_sku: item_sku,
                input: input,
                webhookURL: webhookURL
            }, {
                headers: {
                    'X-API-Key': API_KEY_MIDDLE,
                    'Content-Type': 'application/json'
                }
            });

            const externalData = externalResponse.data;

            if (externalData.order) {
                // Update order with external response
                const orderIndex = orders.findIndex((o: OrderData) => o.id === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].transactionId = externalData.order.transactionId;
                    orders[orderIndex].state = externalData.order.state || 'completed';
                    orders[orderIndex].input = externalData.order.input;
                    orders[orderIndex].productMetadata = externalData.order.productMetadata;
                    orders[orderIndex].createdAt = externalData.order.createdAt;
                    orders[orderIndex].updatedAt = externalData.order.updatedAt;
                    orders[orderIndex].finishedAt = externalData.order.finishedAt;
                    orders[orderIndex].result_code = externalData.order.result_code;
                    save('orders.json', orders);
                }

                // Deduct balance from user
                const newBalance = userBalance - itemPrice;
                users[userIndex].balance = newBalance;
                save('users.json', users);

                // Return success response
                return NextResponse.json({
                    success: true,
                    message: 'สั่งซื้อสำเร็จ',
                    data: {
                        order: {
                            transactionId: externalData.order.transactionId,
                            price: externalData.order.price,
                            userId: parseInt(decoded.id),
                            state: externalData.order.state || 'completed',
                            input: externalData.order.input,
                            productMetadata: externalData.order.productMetadata,
                            createdAt: externalData.order.createdAt,
                            updatedAt: externalData.order.updatedAt,
                            finishedAt: externalData.order.finishedAt,
                            result_code: externalData.order.result_code
                        },
                        user: {
                            id: parseInt(decoded.id),
                            username: user.username,
                            balance: newBalance.toString(),
                            balance_used: itemPrice.toString()
                        }
                    }
                });

            } else {
                // External API failed
                const orderIndex = orders.findIndex((o: OrderData) => o.id === orderId);
                if (orderIndex !== -1) {
                    orders[orderIndex].state = 'failed';
                    orders[orderIndex].updatedAt = new Date().toISOString();
                    save('orders.json', orders);
                }

                return NextResponse.json({
                    success: false,
                    message: 'การสั่งซื้อล้มเหลว'
                }, { status: 500 });
            }

        } catch (externalError: any) {
            console.error('External API error:', externalError);

            // Update order state to failed
            const orderIndex = orders.findIndex((o: OrderData) => o.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].state = 'failed';
                orders[orderIndex].updatedAt = new Date().toISOString();
                save('orders.json', orders);
            }

            return NextResponse.json({
                success: false,
                message: 'การสั่งซื้อล้มเหลว กรุณาลองใหม่อีกครั้ง'
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Topup buy error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสั่งซื้อ'
        }, { status: 500 });
    }
}


