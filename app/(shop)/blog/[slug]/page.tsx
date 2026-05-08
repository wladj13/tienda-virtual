import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {post.coverImage && (
        <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <p className="text-sm text-slate-500">
          {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
            addSuffix: true,
            locale: es,
          })}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{post.title}</h1>
      </header>

      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
