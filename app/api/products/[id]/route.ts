import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

    // Check if slug or SKU already exists for another product
    const existing = await prisma.product.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ slug }, { sku }] },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: existing.slug === slug ? 'Slug already exists' : 'SKU already exists' },
        { status: 400 }
      );
    }

    // Clear all categories first
    await prisma.product.update({
      where: { id },
      data: { categories: { set: [] } },
    });

    const product = await prisma.product.update({
      where: { id },
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
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { categories: true },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}
