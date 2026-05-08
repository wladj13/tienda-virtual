import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { categories: true },
  });
  return product;
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Editar producto</h1>
        <p className="text-sm text-slate-500 mt-1">Actualiza la información del producto</p>
      </div>

      <ProductForm product={product} categories={categories} isEditing />
    </div>
  );
}
