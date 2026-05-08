'use client';

import { useCartStore } from '@/store/cart';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCartStore();
  const existingItem = items.find((i) => i.productId === product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] || '',
      quantity: 1,
      stock: product.stock,
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={`w-full rounded-lg px-6 py-3 font-semibold transition ${
        isOutOfStock
          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-500'
      }`}
    >
      {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
    </button>
  );
}
