'use client';

import Link from 'next/link';
import { Package, User } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mi Cuenta</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">Invitado</p>
              <p className="text-sm text-slate-500">Inicia sesión para ver tu perfil</p>
            </div>
          </div>
          <Link
            href="/sign-in"
            className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="border-b px-6 py-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-500" />
              <h2 className="font-semibold">Mis pedidos</h2>
            </div>
            <div className="px-6 py-12 text-center text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No tienes pedidos aún.</p>
              <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline">
                Ver productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
