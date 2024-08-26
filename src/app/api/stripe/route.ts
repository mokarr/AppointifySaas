import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { stripe } from '@/libs/stripe';
import { absoluteUrl } from '@/utils/absoluteUrl';

const settingsUrl = absoluteUrl('/settings');

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!user || !userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // look if there is a existing organization
    // const userSubscription = await

    // If not existing make new

    const email = user.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return new NextResponse('Email not found', { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0]?.emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'EUR',
            product_data: {
              name: 'PRO',
              description: 'Unlimeted account',
            },
            unit_amount: 2000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log('[STRIPE_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
