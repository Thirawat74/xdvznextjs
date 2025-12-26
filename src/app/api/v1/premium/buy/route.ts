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
    state: 'pending' | 'completed' | 'failed' | 'processing';
    price: number;
    data?: string;
    productMetadata?: {
        key: string;
        price: number;
    };
    createdAt: string;
    updatedAt: string;
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
        const { id, reference } = await request.json();

        // Validate request body
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'กรุณาระบุรหัสสินค้า'
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

        // Get service details to check price
        let servicePrice = 0;
        try {
            const servicesResponse = await axios.get(`${API_URL_MIDDLE}/api/v1/premium/services/list`, {
                headers: {
                    'X-API-Key': API_KEY_MIDDLE
                }
            });

            const service = servicesResponse.data.services?.find((s: any) => s.id == id);
            if (!service) {
                return NextResponse.json({
                    success: false,
                    message: 'ไม่พบสินค้าที่ระบุ'
                }, { status: 404 });
            }

            servicePrice = parseFloat(service.price) || 0;

            if (servicePrice <= 0) {
                return NextResponse.json({
                    success: false,
                    message: 'ราคาสินค้าไม่ถูกต้อง'
                }, { status: 400 });
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
            return NextResponse.json({
                success: false,
                message: 'ไม่สามารถตรวจสอบข้อมูลสินค้าได้'
            }, { status: 500 });
        }

        // Check if user has enough balance
        if (userBalance < servicePrice) {
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
            productId: id.toString(),
            type: 'premium',
            reference: reference,
            state: 'processing',
            price: servicePrice,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save order to database
        const orders = read('orders.json') || [];
        orders.push(orderData);
        save('orders.json', orders);

        try {
            // Call external API to create order
            const externalResponse = await axios.post(`${API_URL_MIDDLE}/api/v1/agent/premium/create`, {
                id: id,
                reference: reference || orderId
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
                    orders[orderIndex].data = externalData.order.data;
                    orders[orderIndex].productMetadata = externalData.order.productMetadata;
                    orders[orderIndex].updatedAt = new Date().toISOString();
                    save('orders.json', orders);
                }

                // Deduct balance from user
                const newBalance = userBalance - servicePrice;
                users[userIndex].balance = newBalance;
                save('users.json', users);

                // Return success response
                return NextResponse.json({
                    success: true,
                    message: 'สั่งซื้อสำเร็จ',
                    data: {
                        order: {
                            transactionId: externalData.order.transactionId,
                            state: externalData.order.state || 'completed',
                            data: externalData.order.data,
                            productMetadata: externalData.order.productMetadata
                        },
                        user: {
                            balance: newBalance.toString(),
                            balance_used: servicePrice.toString()
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
        console.error('Premium buy error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสั่งซื้อ'
        }, { status: 500 });
    }
}