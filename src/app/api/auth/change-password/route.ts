import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { read, save } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

export async function POST(request: NextRequest) {
    try {
        const { currentPassword, newPassword } = await request.json();

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

        // Check current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return NextResponse.json({
                success: false,
                message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
            }, { status: 400 });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return NextResponse.json({
                success: false,
                message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร'
            }, { status: 400 });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        users[userIndex].password = hashedNewPassword;
        save('users.json', users);

        return NextResponse.json({
            success: true,
            message: 'เปลี่ยนรหัสผ่านสำเร็จ'
        });

    } catch (error) {
        console.error('Change password error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({
                success: false,
                message: 'Token ไม่ถูกต้อง'
            }, { status: 401 });
        }

        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
        }, { status: 500 });
    }
}
