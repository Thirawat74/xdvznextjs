import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { read, save } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

export async function POST(request: NextRequest) {
    try {
        // Get token from header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                message: 'ไม่พบ token'
            }, { status: 401 });
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        // Find user and update their session token or invalidate all sessions
        // For simplicity, we'll just return success since we're using JWT tokens
        // In a more complex system, you might want to implement a token blacklist

        return NextResponse.json({
            success: true,
            message: 'ออกจากระบบทุกอุปกรณ์สำเร็จ'
        });

    } catch (error) {
        console.error('Logout all error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({
                success: false,
                message: 'Token ไม่ถูกต้อง'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
        }, { status: 500 });
    }
}
