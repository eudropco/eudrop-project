import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  // 'checkout.session.completed' etkinliğini dinliyoruz
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Ödeme sırasında eklediğimiz metadata'dan kullanıcı ID'sini alıyoruz
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session metadata' }, { status: 400 });
    }

    // Hangi üyeliği satın aldığını buluyoruz
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0].price?.id;

    let newTier = 'Free';
    if (priceId === 'price_1ReqY8IJnqxvV31e1k53UM8y') { // Sizin Netrunner Price ID'niz
        newTier = 'Netrunner';
    } else if (priceId === 'price_1ReqYxIJnqxvV31e3Bk2AB9f') { // Sizin Street Samurai Price ID'niz
        newTier = 'Street Samurai';
    } else if (priceId === 'price_1ReqZXIJnqxvV31e64lbsTDO') { // Sizin Fixer Price ID'niz
        newTier = 'Fixer';
    }

    // Kullanıcının üyelik seviyesini veritabanında güncelliyoruz
    await prisma.user.update({
      where: { id: userId },
      data: { membershipTier: newTier },
    });

    console.log(`SUCCESS: User ${userId} upgraded to ${newTier}.`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}