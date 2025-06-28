export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sealData } from 'iron-session';

// Bu, cookie ayarlarını önceden tanımlamamızı sağlar
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // 1 gün
  path: '/',
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const sessionPassword = process.env.JWT_SECRET!;
    
    const sealedSession = await sealData({ userId: user.id }, {
      password: sessionPassword,
      ttl: 60 * 60 * 24,
    });

    // DOĞRU YÖNTEM: NextResponse objesini oluşturup,
    // onun üzerinden cookie'yi ayarlıyoruz.
    const response = NextResponse.json({ success: true, message: 'Login successful!' });

    response.cookies.set('session', sealedSession, cookieOptions);

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}