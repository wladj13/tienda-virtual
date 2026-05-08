import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, slug, excerpt, content, coverImage, published } = await req.json();

    const existing = await prisma.blogPost.findFirst({
      where: { AND: [{ id: { not: id } }, { slug }] },
    });
    if (existing) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 400 });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: { title, slug, excerpt, content, coverImage, published },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
  }
}
