import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-blue-400">TuTienda</h3>
            <p className="mt-4 text-slate-400">
              Tu destino para productos de calidad con la mejor experiencia de compra online.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold">Tienda</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold">Soporte</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/help" className="text-slate-400 hover:text-white transition">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} TuTienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
