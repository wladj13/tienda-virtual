'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const shipping = total >= 50 ? 0 : 9.99;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postal: '',
    country: 'US',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: form,
          subtotal: total,
          shipping,
          total: total + shipping,
        }),
      });

      const { sessionId, error } = await res.json();

      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe!.redirectToCheckout({ sessionId });

      if (stripeError) {
        toast.error(stripeError.message || 'Error al procesar el pago');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Error al procesar el pago');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <p className="text-slate-600">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Información de contacto</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-4 py-2 mb-4"
            />
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Dirección de envío</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" name="firstName" placeholder="Nombre" required value={form.firstName} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2" />
              <input type="text" name="lastName" placeholder="Apellido" required value={form.lastName} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2" />
              <input type="text" name="address1" placeholder="Dirección" required value={form.address1} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2 sm:col-span-2" />
              <input type="text" name="address2" placeholder="Apartamento, suite, etc." value={form.address2} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2 sm:col-span-2" />
              <input type="text" name="city" placeholder="Ciudad" required value={form.city} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2" />
              <input type="text" name="state" placeholder="Estado" required value={form.state} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2" />
              <input type="text" name="postal" placeholder="Código postal" required value={form.postal} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2" />
              <input type="tel" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="rounded-md border border-slate-300 px-4 py-2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : `Pagar ${formatPrice(total + shipping)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <div className="rounded-lg border bg-white p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
            <div className="space-y-3 text-sm max-h-64 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                    {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-slate-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Envío</span>
                <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total + shipping)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
