'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TuTienda
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/products" className="text-slate-600 hover:text-blue-600 transition">
              Productos
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition">
              Blog
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth - Simple link for now */}
            <Link href="/sign-in" className="p-2 text-slate-600 hover:text-blue-600 transition">
              <User className="h-6 w-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/products" className="text-slate-600 hover:text-blue-600 transition">
                Productos
              </Link>
              <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition">
                Blog
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
