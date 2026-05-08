'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { slugify } from '@/lib/utils';

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  sku: string;
  stock: number;
  images: string | string[];
  featured: boolean;
  active: boolean;
  categories?: { id: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  isEditing?: boolean;
}

function parseImages(images: string | string[]): string[] {
  if (Array.isArray(images)) return images;
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
}

export function ProductForm({ product, categories, isEditing }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    sku: product?.sku || '',
    stock: product?.stock || 0,
    images: parseImages(product?.images || []).join('\n'),
    featured: product?.featured || false,
    active: product?.active ?? true,
    categoryId: product?.categories?.[0]?.id || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({
      ...form,
      name,
      slug: slugify(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(String(form.price)),
        comparePrice: form.comparePrice ? parseFloat(String(form.comparePrice)) : null,
        stock: parseInt(String(form.stock)),
        images: form.images.split('\n').filter(Boolean),
        categoryId: form.categoryId || null,
      };

      const url = isEditing ? `/api/products/${product?.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error saving product');
      }

      toast.success(isEditing ? 'Producto actualizado' : 'Producto creado');
      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nombre del producto
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleNameChange}
            required
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Slug (URL)
          </label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-4 py-2 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">/products/{form.slug || '...'}</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Categoría
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full rounded-md border border-slate-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Precio anterior (opcional)
            </label>
            <input
              type="number"
              name="comparePrice"
              value={form.comparePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full rounded-md border border-slate-300 px-4 py-2"
            />
          </div>
        </div>

        {/* SKU and Stock */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full rounded-md border border-slate-300 px-4 py-2"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            URLs de imágenes (una por línea)
          </label>
          <textarea
            name="images"
            value={form.images}
            onChange={handleChange}
            rows={3}
            placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
            className="w-full rounded-md border border-slate-300 px-4 py-2 font-mono text-sm"
          />
        </div>

        {/* Featured and Active */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Producto destacado</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Activo (visible en tienda)</span>
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
          {loading ? 'Guardando...' : isEditing ? 'Actualizar producto' : 'Crear producto'}
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
