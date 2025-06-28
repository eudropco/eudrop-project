export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session'; // Merkezi fonksiyonumuzu kullanıyoruz
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  // Kullanıcıyı bulma işini merkezi fonksiyonumuza bırakıyoruz.
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { newTier } = await request.json();
  if (!newTier) {
    return NextResponse.json({ message: 'New tier not specified' }, { status: 400 });
  }

  try {
    // Veritabanında kullanıcının üyelik seviyesini güncelliyoruz.
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipTier: newTier },
    });

    console.log(`SUCCESS: User ${user.username} upgraded to ${newTier}.`);
    return NextResponse.json({ success: true, message: `Successfully upgraded to ${newTier}!` });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}