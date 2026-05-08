import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nuevo producto</h1>
        <p className="text-sm text-slate-500 mt-1">Agrega un producto al catálogo</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
