import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { read, save } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'ไม่พบ token'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Update user to disable 2FA
    const users = read('users.json') || [];
    const userIndex = users.findIndex((user: any) => user.id === decoded.id);

    if (userIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      }, { status: 404 });
    }

    users[userIndex].twoFactorEnabled = false;
    users[userIndex].twoFactorSecret = null;
    save('users.json', users);

    return NextResponse.json({
      success: true,
      message: 'ปิดใช้งาน 2FA สำเร็จ'
    });

  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการปิดใช้งาน 2FA'
    }, { status: 500 });
  }
}






