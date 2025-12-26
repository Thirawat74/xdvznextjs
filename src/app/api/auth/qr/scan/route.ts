import { NextRequest, NextResponse } from 'next/server';
import { read, save } from 'soly-db';
import jwt from 'jsonwebtoken';

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

        // Get QR data from request body
        const { qrData } = await request.json();

        if (!qrData) {
            return NextResponse.json({
                success: false,
                message: 'QR data is required'
            }, { status: 400 });
        }

        // Parse QR data
        let parsedQrData;
        try {
            parsedQrData = JSON.parse(qrData);
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: 'Invalid QR code format'
            }, { status: 400 });
        }

        if (parsedQrData.type !== 'login' || !parsedQrData.sessionId) {
            return NextResponse.json({
                success: false,
                message: 'Invalid QR code'
            }, { status: 400 });
        }

        const { sessionId } = parsedQrData;

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

        // Check if session is expired
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);

        if (now > expiresAt) {
            session.status = 'expired';
            save('qr_sessions.json', sessions);
            return NextResponse.json({
                success: false,
                message: 'QR code has expired'
            }, { status: 400 });
        }

        // Check if session is already scanned or verified
        if (session.status !== 'pending') {
            return NextResponse.json({
                success: false,
                message: 'QR code has already been used'
            }, { status: 400 });
        }

        // Update session status to scanned
        session.status = 'scanned';
        session.scannedAt = new Date().toISOString();
        session.userId = decoded.id; // Store the scanner's user ID

        save('qr_sessions.json', sessions);

        return NextResponse.json({
            success: true,
            message: 'QR code scanned successfully',
            sessionId: sessionId
        });

    } catch (error) {
        console.error('QR scan error:', error);
        return NextResponse.json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสแกน QR code'
        }, { status: 500 });
    }
}
