import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const {
      name,
      slug,
      description,
      price,
      comparePrice,
      sku,
      stock,
      images,
      featured,
      active,
      categoryId,
    } = await req.json();

    // Check if slug or SKU already exists
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { sku }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: existing.slug === slug ? 'Slug already exists' : 'SKU already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice,
        sku,
        stock,
        images,
        featured: featured || false,
        active: active ?? true,
        ...(categoryId && {
          categories: {
            connect: { id: categoryId },
          },
        }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Error creating product' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { categories: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
  }
}
