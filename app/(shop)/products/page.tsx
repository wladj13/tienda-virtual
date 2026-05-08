import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { ProductFilters } from '@/components/shop/ProductFilters';

interface SearchParams {
  category?: string;
  sort?: string;
}

async function getProducts(searchParams: SearchParams) {
  const where: any = { active: true };

  if (searchParams.category) {
    where.categories = { some: { slug: searchParams.category } };
  }

  let orderBy: any;
  switch (searchParams.sort) {
    case 'price-asc': orderBy = { price: 'asc' }; break;
    case 'price-desc': orderBy = { price: 'desc' }; break;
    case 'newest': orderBy = { createdAt: 'desc' }; break;
    case 'name': orderBy = { name: 'asc' }; break;
    default: orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
  }

  return prisma.product.findMany({
    where,
    orderBy,
    include: { categories: true },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });
}

function parseImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
        <p className="mt-2 text-slate-600">Encuentra los mejores productos para ti</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <ProductFilters categories={categories} />
        </Suspense>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-600">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const images = parseImages(product.images);
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative bg-slate-100">
                      {images[0] ? (
                        <Image
                          src={images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">
                        {product.categories[0]?.name || 'Sin categoría'}
                      </p>
                      <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-slate-500 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
