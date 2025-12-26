import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { read, save } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

export async function POST(request: NextRequest) {
    try {
        const { username, profile } = await request.json();

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

        // Validate username
        if (!username || username.trim().length === 0) {
            return NextResponse.json({
                success: false,
                message: 'กรุณากรอกชื่อผู้ใช้งาน'
            }, { status: 400 });
        }

        if (username.length < 3) {
            return NextResponse.json({
                success: false,
                message: 'ชื่อผู้ใช้งานต้องมีอย่างน้อย 3 ตัวอักษร'
            }, { status: 400 });
        }

        if (username.length > 30) {
            return NextResponse.json({
                success: false,
                message: 'ชื่อผู้ใช้งานต้องไม่เกิน 30 ตัวอักษร'
            }, { status: 400 });
        }

        // Check if username is already taken by another user
        const existingUser = users.find((u: any) =>
            u.username === username.trim() && u.id !== user.id
        );
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว'
            }, { status: 400 });
        }

        // Validate profile URL if provided
        if (profile && profile.trim()) {
            try {
                const url = new URL(profile.trim());
                if (!['http:', 'https:'].includes(url.protocol)) {
                    return NextResponse.json({
                        success: false,
                        message: 'URL รูปโปรไฟล์ต้องเป็น HTTP หรือ HTTPS'
                    }, { status: 400 });
                }
            } catch {
                return NextResponse.json({
                    success: false,
                    message: 'URL รูปโปรไฟล์ไม่ถูกต้อง'
                }, { status: 400 });
            }
        }

        // Update user data
        users[userIndex].username = username.trim();
        users[userIndex].profile = profile && profile.trim() ? profile.trim() : null;

        save('users.json', users);

        // Return updated user data (without password and sensitive info)
        const { password: _, twoFactorSecret: __, ...updatedUser } = users[userIndex];

        return NextResponse.json({
            success: true,
            message: 'อัปเดตข้อมูลส่วนตัวสำเร็จ',
            data: {
                user: updatedUser
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({
                success: false,
                message: 'Token ไม่ถูกต้อง'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลส่วนตัว'
        }, { status: 500 });
    }
}
