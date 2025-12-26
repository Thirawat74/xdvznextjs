import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { read, save } from 'soly-db';

const JWT_SECRET = process.env.JWT_SECRET || 'webshop_by_proleak';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, confirmPassword } = await request.json();

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'รหัสผ่านไม่ตรงกัน'
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
      }, { status: 400 });
    }

    // Check if email or username already exists
    const users = read('users.json') || [];
    const existingUser = users.find((user: any) =>
      user.email === email || user.username === username
    );

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'อีเมลหรือชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว'
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: 0, // Default to regular user
      profile: null,
      time: new Date().toISOString()
    };

    users.push(newUser);
    save('users.json', users);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
    }, { status: 500 });
  }
}
