import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';

async function getPosts() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
        <Link
          href="/dashboard/blog/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          Nueva entrada
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No hay entradas. Crea la primera.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{post.title}</p>
                    <p className="text-sm text-slate-500 truncate max-w-md">{post.excerpt}</p>
                  </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">Sistema</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {format(new Date(post.createdAt), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {post.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex gap-3 justify-end">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900">
                      <Eye className="h-4 w-4" />Ver
                    </Link>
                    <Link href={`/dashboard/blog/${post.id}/edit`} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500">
                      <Edit className="h-4 w-4" />Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
