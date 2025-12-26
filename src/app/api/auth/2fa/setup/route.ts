import { NextRequest, NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
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

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `Web Store (${decoded.email})`,
      issuer: 'Web Store'
    });

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return NextResponse.json({
      success: true,
      message: 'สร้าง 2FA สำเร็จ',
      data: {
        secret: secret.base32,
        qrCodeUrl,
        otpauth_url: secret.otpauth_url
      }
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตั้งค่า 2FA'
    }, { status: 500 });
  }
}






