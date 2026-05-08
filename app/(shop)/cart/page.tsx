'use client';

import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Tu carrito está vacío</h1>
          <p className="mt-2 text-slate-600">Agrega productos para comenzar</p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Carrito de compras</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border bg-white p-4">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <Link href={`/products/${item.productId}`} className="font-medium text-slate-900 hover:text-blue-600">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">SKU: {item.productId}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="rounded-md border p-1 hover:bg-slate-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="rounded-md border p-1 hover:bg-slate-100 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Envío</span>
                <span>{total >= 50 ? 'Gratis' : formatPrice(9.99)}</span>
              </div>
              {total < 50 && (
                <p className="text-xs text-green-600">
                  ¡Agrega {formatPrice(50 - total)} más para envío gratis!
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total + (total >= 50 ? 0 : 9.99))}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-500"
            >
              Proceder al pago
            </Link>
            <Link
              href="/products"
              className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
