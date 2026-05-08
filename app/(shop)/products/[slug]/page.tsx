import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatPrice, parseImages } from '@/lib/utils';
import { Star, Shield, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { ProductReviews } from '@/components/shop/ProductReviews';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      categories: true,
      reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  if (!product) return null;

  // Parse images from JSON string to array
  const images = parseImages(product.images);

  // Get average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  // Build return object with parsed images
  const result = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    sku: product.sku,
    stock: product.stock,
    images,
    featured: product.featured,
    active: product.active,
    weight: product.weight,
    dimensions: product.dimensions,
    categories: product.categories,
    reviews: product.reviews,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    avgRating,
  };

  return result;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-100">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Sin imagen
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square relative rounded-lg overflow-hidden bg-slate-100">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-blue-600 mb-2">
            {product.categories[0]?.name}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(product.avgRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">
              ({product.reviews.length} reseñas)
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(Number(product.price))}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-xl text-slate-500 line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                  -
                  {Math.round(
                    (1 - Number(product.price) / Number(product.comparePrice)) * 100
                  )}
                  %
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className={`mt-4 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
          </p>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <p className="text-slate-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 gap-4 border-t pt-8">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-slate-400" />
              <span className="text-sm">Envío gratis en pedidos mayores a $50</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <span className="text-sm">Garantía de devolución de 30 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ProductReviews productId={product.id} reviews={product.reviews} />
      </div>
    </div>
  );
}
