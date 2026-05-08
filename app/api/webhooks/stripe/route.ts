import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    const userId = session.metadata?.userId;
    const shippingAddress = JSON.parse(session.metadata?.shippingAddress || '{}');
    const subtotal = parseFloat(session.metadata?.subtotal || '0');
    const shipping = parseFloat(session.metadata?.shipping || '0');
    const total = parseFloat(session.metadata?.total || '0');
    const items = JSON.parse(session.metadata?.items || '[]');

    try {
      // Generate order number
      const orderCount = await prisma.order.count();
      const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: userId || 'anonymous',
          status: 'PROCESSING',
          subtotal,
          shipping,
          tax: 0,
          total,
          shippingAddress,
          paymentMethod: session.payment_method_types?.[0] || 'card',
          paymentIntentId: session.payment_intent,
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: 0, // Will update below
              total: 0,
            })),
          },
        },
        include: { orderItems: true },
      });

      // Update order items with prices
      for (const item of order.orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (product) {
          const price = Number(product.price);
          await prisma.orderItem.update({
            where: { id: item.id },
            data: {
              price,
              total: price * item.quantity,
            },
          });
        }
      }

      // Update product stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      console.log(`Order ${orderNumber} created successfully`);
    } catch (err) {
      console.error('Error creating order:', err);
      return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
