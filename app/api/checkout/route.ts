import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { items, shippingAddress, subtotal, shipping, total } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Create or get user by email
    let user = await prisma.user.findUnique({
      where: { email: shippingAddress.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: shippingAddress.email,
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        },
      });
    }

    // Create Stripe session
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: shippingAddress.email,
      metadata: {
        userId: user.id,
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal: subtotal.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
        items: JSON.stringify(items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}
