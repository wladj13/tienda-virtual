'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';

function CheckoutSuccessContent() {
  const router = useSearchParams();
  const sessionId = router.get('session_id');
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900">¡Pedido confirmado!</h1>
      <p className="mt-4 text-lg text-slate-600">
        Gracias por tu compra. Recibirás un email de confirmación en breve.
      </p>

      {sessionId && (
        <p className="mt-2 text-sm text-slate-500">
          ID de sesión: {sessionId}
        </p>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/account"
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-200 transition"
        >
          <Package className="h-5 w-5" />
          Ver mis pedidos
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition"
        >
          Continuar comprando
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-center">Cargando...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
