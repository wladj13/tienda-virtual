import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (email) {
    const orders = await prisma.order.findMany({
      where: { user: { email } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}
