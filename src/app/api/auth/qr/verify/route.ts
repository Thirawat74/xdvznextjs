import { NextRequest, NextResponse } from 'next/server';
import { read, save } from 'soly-db';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

interface QRSession {
    id: string;
    status: 'pending' | 'scanned' | 'verified' | 'expired';
    qrCode: string;
    expiresAt: string;
    createdAt: string;
    scannedAt?: string;
    verifiedAt?: string;
    userId?: string;
    token?: string;
    user?: any;
}

export async function POST(request: NextRequest) {
    try {
        // Get token from Authorization header (scanner user)
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

        // Get request body
        const { sessionId, twoFactorToken } = await request.json();

        if (!sessionId) {
            return NextResponse.json({
                success: false,
                message: 'Session ID is required'
            }, { status: 400 });
        }

        // Get sessions from database
        const sessions: QRSession[] = read('qr_sessions.json') || [];
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);

        if (sessionIndex === -1) {
            return NextResponse.json({
                success: false,
                message: 'Session not found'
            }, { status: 404 });
        }

        const session = sessions[sessionIndex];

        // Check if session belongs to the scanner
        if (session.userId !== decoded.id) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized access to this session'
            }, { status: 403 });
        }

        // Check if session is scanned
        if (session.status !== 'scanned') {
            return NextResponse.json({
                success: false,
                message: 'Session is not in scanned state'
            }, { status: 400 });
        }

        // Check if session is expired
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);

        if (now > expiresAt) {
            session.status = 'expired';
            save('qr_sessions.json', sessions);
            return NextResponse.json({
                success: false,
                message: 'Session has expired'
            }, { status: 400 });
        }

        // Get scanner user data
        const users = read('users.json') || [];
        const scannerUser = users.find((user: any) => user.id === decoded.id);

        if (!scannerUser) {
            return NextResponse.json({
                success: false,
                message: 'Scanner user not found'
            }, { status: 404 });
        }

        // Check if user has 2FA enabled
        if (scannerUser.twoFactorEnabled && scannerUser.twoFactorSecret) {
            if (!twoFactorToken) {
                return NextResponse.json({
                    success: false,
                    message: 'กรุณาป้อนรหัส 2FA',
                    requiresTwoFactor: true
                }, { status: 400 });
            }

            // Verify 2FA token
            const verified = speakeasy.totp.verify({
                secret: scannerUser.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorToken,
                window: 2 // Allow 30 seconds window
            });

            if (!verified) {
                return NextResponse.json({
                    success: false,
                    message: 'รหัส 2FA ไม่ถูกต้อง'
                }, { status: 400 });
            }
        }

        // Generate JWT token for the target device
        const authToken = jwt.sign(
            {
                id: scannerUser.id,
                username: scannerUser.username,
                email: scannerUser.email,
                role: scannerUser.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update session to verified
        session.status = 'verified';
        session.verifiedAt = new Date().toISOString();
        session.token = authToken;

        // Remove password and sensitive data from user object
        const { password: _, twoFactorSecret: __, ...userWithoutSensitive } = scannerUser;
        session.user = userWithoutSensitive;

        save('qr_sessions.json', sessions);

        return NextResponse.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            data: {
                token: authToken,
                user: userWithoutSensitive
            }
        });

    } catch (error) {
        console.error('QR verify error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการยืนยันการเข้าสู่ระบบ'
        }, { status: 500 });
    }
}
