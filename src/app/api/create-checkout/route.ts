import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only if API key is available
const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!apiKey || apiKey === 'your_stripe_secret_key_here' || apiKey === '') {
    console.error('Stripe API key is missing or invalid');
    return null;
  }
  console.log('Stripe API key found, initializing...');
  try {
    return new Stripe(apiKey, {
      apiVersion: '2024-06-20',
    });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { amount, label, message } = await request.json();

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $1 AUD.' },
        { status: 400 }
      );
    }

    // Check if Stripe is configured
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set up your Stripe keys in environment variables.' },
        { status: 503 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: label || 'Support Usama Javed',
              description: message || 'Thank you for your support!',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'en',
      success_url: `https://usamajaved.com.au/fund-me/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://usamajaved.com.au/fund-me?canceled=true`,
      metadata: {
        label: label || 'Custom Donation',
        message: message || '',
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    console.error('Error details:', {
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}