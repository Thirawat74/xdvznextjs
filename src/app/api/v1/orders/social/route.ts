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
    state: 'pending' | 'completed' | 'failed' | 'processing';
    price: number;
    data?: string;
    productMetadata?: {
        link?: string;
        quantity?: number;
        runs?: number;
        interval?: number;
        key: string;
        price: number;
    };
    createdAt: string;
    updatedAt: string;
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

        // Get user's social orders
        const orders: OrderData[] = read('orders.json') || [];
        const userSocialOrders = orders
            .filter(order => order.userId === decoded.id && order.type === 'social')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by newest first

        // Format response
        const formattedOrders = userSocialOrders.map(order => ({
            id: order.id,
            productId: order.productId,
            transactionId: order.transactionId,
            state: order.state,
            price: order.price,
            data: order.data,
            productMetadata: order.productMetadata,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        return NextResponse.json({
            success: true,
            orders: formattedOrders,
            count: formattedOrders.length
        });

    } catch (error) {
        console.error('Social orders error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        }, { status: 500 });
    }
}




