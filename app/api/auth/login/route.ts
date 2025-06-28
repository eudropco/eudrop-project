import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sealData } from 'iron-session'; // jwt yerine iron-session'ın sealData'sını kullanıyoruz
import { cookies } from 'next/headers';

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

    // Kullanıcı ID'sini şifreleyip bir "mühür" oluşturuyoruz.
    const sealedSession = await sealData({ userId: user.id }, {
      password: sessionPassword,
      ttl: 60 * 60 * 24, // 1 gün
    });

    // Bu mühürlenmiş veriyi cookie olarak ayarlıyoruz.
    cookies().set('session', sealedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}