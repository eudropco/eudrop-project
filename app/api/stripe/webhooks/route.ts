import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2024-06-20',
});

const relevantEvents = new Set([
  'checkout.session.completed',
]);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          throw new Error('User ID not found in session metadata');
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0].price.id;

        let newTier = 'Free';
        // Not: Buradaki price ID'leri sizin CANLI moddaki ID'leriniz olmalı.
        if (priceId === 'price_...') { // Netrunner Price ID
            newTier = 'Netrunner';
        } else if (priceId === 'price_...') { // Street Samurai Price ID
            newTier = 'Street Samurai';
        } else if (priceId === 'price_...') { // Fixer Price ID
            newTier = 'Fixer';
        }

        await prisma.user.update({
          where: { id: userId },
          data: { membershipTier: newTier },
        });
        console.log(`Webhook Success: User ${userId} upgraded to ${newTier}.`);
      }
    } catch (error: any) {
      console.log(`Webhook handler failed. Error: ${error.message}`);
      return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}