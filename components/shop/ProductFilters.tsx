'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export function ProductFilters({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort') || '';

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg border p-6 sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold">Filtros</h2>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Categorías</h3>
          <div className="space-y-1">
            <Link
              href="/products"
              className={`block py-1 text-sm ${
                !currentCategory ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`block py-1 text-sm ${
                    currentCategory === cat.slug
                      ? 'text-blue-600 font-medium'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {cat.name}
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <div className="ml-3 space-y-1">
                    {cat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/products?category=${child.slug}`}
                        className={`block py-1 text-sm ${
                          currentCategory === child.slug
                            ? 'text-blue-600 font-medium'
                            : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Ordenar por</h3>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={currentSort}
            onChange={(e) => {
              const url = new URL(window.location.href);
              if (e.target.value) url.searchParams.set('sort', e.target.value);
              else url.searchParams.delete('sort');
              window.location.href = url.toString();
            }}
          >
            <option value="">Destacados</option>
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
