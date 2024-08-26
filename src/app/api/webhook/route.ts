import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import {
  addOrganization,
  updateOrganization,
} from '@/actions/organizationAction';
import { stripe } from '@/libs/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    if (!session?.metadata?.userId) {
      return new NextResponse('user id is required', { status: 400 });
    }

    await addOrganization({
      id: session?.metadata?.userId as string,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionPriceId: subscription.items.data[0]?.price?.id ?? '', // Must be checked
      stripeSubscriptionStatus: subscription.status,
      stripeSubscriptionCurrentPeriodEnd: subscription.current_period_end,
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await updateOrganization({
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionCurrentPeriodEnd: subscription.current_period_end,
    });
  }

  return new NextResponse(null, { status: 200 });
}
