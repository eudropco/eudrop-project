import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    // --- DÜZELTME BURADA BAŞLIYOR ---

    // 1. Önce başarılı bir cevap objesi oluşturuyoruz.
    const response = NextResponse.json({ success: true, message: 'Login successful!' });

    // 2. Sonra bu cevabın üzerine, cookie'yi set ediyoruz (ayarlıyoruz).
    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 gün
      path: '/',
    });

    // 3. En sonda, cookie eklenmiş bu yeni cevabı döndürüyoruz.
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}