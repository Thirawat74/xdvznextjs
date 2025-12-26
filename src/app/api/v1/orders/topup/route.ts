import { NextRequest, NextResponse } from 'next/server';
import { read } from 'soly-db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

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

export async function GET(request: NextRequest) {
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

        // Get user's topup orders
        const orders: OrderData[] = read('orders.json') || [];
        const userTopupOrders = orders
            .filter(order => order.userId === decoded.id && order.type === 'topup_game')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by newest first

        // Format response
        const formattedOrders = userTopupOrders.map(order => ({
            id: order.id,
            productId: order.productId,
            transactionId: order.transactionId,
            state: order.state,
            price: order.price,
            input: order.input,
            productMetadata: order.productMetadata,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            finishedAt: order.finishedAt,
            result_code: order.result_code
        }));

        return NextResponse.json({
            success: true,
            orders: formattedOrders,
            count: formattedOrders.length
        });

    } catch (error) {
        console.error('Topup orders error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        }, { status: 500 });
    }
}


