import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { read } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

export async function POST(request: NextRequest) {
    try {
        const { identifier, password } = await request.json();

        // Validation
        if (!identifier || !password) {
            return NextResponse.json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            }, { status: 400 });
        }

        // Find user by email or username
        const users = read('users.json') || [];
        const user = users.find((user: any) =>
            user.email === identifier || user.username === identifier
        ) as any;

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'ชื่อผู้ใช้งานหรืออีเมลไม่ถูกต้อง'
            }, { status: 401 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: 'รหัสผ่านไม่ถูกต้อง'
            }, { status: 401 });
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled && user.twoFactorSecret) {
            return NextResponse.json({
                success: true,
                message: 'กรุณาป้อนรหัส 2FA',
                data: {
                    requiresTwoFactor: true,
                    userId: user.id
                }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: _, twoFactorSecret: __, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            data: {
                user: userWithoutPassword,
                token,
                requiresTwoFactor: false
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
        }, { status: 500 });
    }
}
