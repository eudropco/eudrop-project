export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
// Artık 'next/headers'a ihtiyacımız yok.
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: '2025-05-28.basil', // Bu versiyonu doğru bırakıyoruz
});

const relevantEvents = new Set([
  'checkout.session.completed',
]);

export async function POST(request: Request) {
  const body = await request.text();
  // DÜZELTME: İmza'yı 'headers()' yerine doğrudan 'request.headers'tan alıyoruz.
  const signature = request.headers.get('stripe-signature') as string;
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
        // Bu ID'leri daha önce Stripe'tan alıp bir yere kaydetmiştiniz.
        if (priceId === 'price_...') { // Sizin Netrunner Price ID'niz
            newTier = 'Netrunner';
        } else if (priceId === 'price_...') { // Sizin Street Samurai Price ID'niz
            newTier = 'Street Samurai';
        } else if (priceId === 'price_...') { // Sizin Fixer Price ID'niz
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