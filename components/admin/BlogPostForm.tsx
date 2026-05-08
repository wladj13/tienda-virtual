'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { slugify } from '@/lib/utils';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  published: boolean;
  authorId?: string;
}

interface BlogPostFormProps {
  post?: BlogPost;
  isEditing?: boolean;
}

export function BlogPostForm({ post, isEditing }: BlogPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    published: post?.published ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm({
      ...form,
      title,
      slug: slugify(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      const url = isEditing ? `/api/blog/${post?.id}` : '/api/blog';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error saving post');
      }

      toast.success(isEditing ? 'Entrada actualizada' : 'Entrada creada');
      router.push('/dashboard/blog');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar entrada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            required
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-4 py-2 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">/blog/{form.slug || '...'}</p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Extracto</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Breve descripción del post..."
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">URL de imagen de portada</label>
          <input
            type="url"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full rounded-md border border-slate-300 px-4 py-2 font-mono text-sm"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contenido (HTML permitido)</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={15}
            placeholder="<p>Contenido del post...</p>"
            className="w-full rounded-md border border-slate-300 px-4 py-2 font-mono text-sm"
          />
        </div>

        {/* Published */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Publicado</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar entrada' : 'Crear entrada'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
