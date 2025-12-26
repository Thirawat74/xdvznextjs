import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { read } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

export async function GET(request: NextRequest) {
  try {
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
    const user = users.find((user: any) => user.id === decoded.id);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'ดึงข้อมูลผู้ใช้สำเร็จ',
      data: {
        user: userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Me error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        success: false,
        message: 'Token ไม่ถูกต้อง'
      }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({
        success: false,
        message: 'Token หมดอายุ'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    }, { status: 500 });
  }
}
