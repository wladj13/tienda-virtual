import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

async function getPost(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Editar entrada</h1>
        <p className="text-sm text-slate-500 mt-1">Actualiza la entrada de blog</p>
      </div>
      <BlogPostForm post={post} isEditing />
    </div>
  );
}
