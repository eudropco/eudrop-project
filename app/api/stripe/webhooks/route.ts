import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-05-28.basil', // DOĞRU API VERSİYONU
});

const relevantEvents = new Set(['checkout.session.completed']);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) { throw new Error('User ID not found in metadata'); }

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0].price.id;

      let newTier = 'Free';
      if (priceId === process.env.price_1ReqY8IJnqxvV31e1k53UM8y) {
          newTier = 'Netrunner';
      } else if (priceId === process.env.price_1ReqYxIJnqxvV31e3Bk2AB9f) {
          newTier = 'Street Samurai';
      } else if (priceId === process.env.price_1ReqZXIJnqxvV31e64lbsTDO) {
          newTier = 'Fixer';
      }

      await prisma.user.update({
        where: { id: userId },
        data: { membershipTier: newTier },
      });
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}