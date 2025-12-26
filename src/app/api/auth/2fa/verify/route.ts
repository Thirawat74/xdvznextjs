import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';
import { read, save } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { secret, token: totpToken } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'ไม่พบ token'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: totpToken,
      window: 2 // Allow 30 seconds window
    });

    if (!verified) {
      return NextResponse.json({
        success: false,
        message: 'รหัส 2FA ไม่ถูกต้อง'
      }, { status: 400 });
    }

    // Update user with 2FA secret
    const users = read('users.json') || [];
    const userIndex = users.findIndex((user: any) => user.id === decoded.id);

    if (userIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      }, { status: 404 });
    }

    users[userIndex].twoFactorSecret = secret;
    users[userIndex].twoFactorEnabled = true;
    save('users.json', users);

    return NextResponse.json({
      success: true,
      message: 'เปิดใช้งาน 2FA สำเร็จ'
    });

  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการยืนยัน 2FA'
    }, { status: 500 });
  }
}






