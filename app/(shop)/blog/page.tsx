import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Blog</h1>
        <p className="mt-4 text-lg text-slate-600">Noticias, consejos y novedades</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-600">No hay publicaciones aún.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.coverImage && (
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm text-slate-500">
                  {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-slate-600 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
