import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

async function getStats() {
  const [products, orders, users, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
  });

  return {
    products,
    orders,
    users,
    totalRevenue: totalRevenue._sum.total || 0,
    recentOrders,
  };
}

export default async function DashboardPage() {
  const { products, orders, users, totalRevenue, recentOrders } = await getStats();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Productos</p>
              <p className="text-3xl font-bold text-slate-900">{products}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pedidos</p>
              <p className="text-3xl font-bold text-slate-900">{orders}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Ingresos</p>
              <p className="text-3xl font-bold text-slate-900">{formatPrice(Number(totalRevenue))}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Usuarios</p>
              <p className="text-3xl font-bold text-slate-900">{users}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Pedidos recientes</h2>
        </div>
        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">No hay pedidos aún</div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">{order.user?.email || 'Cliente'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(Number(order.total))}</p>
                  <p className={`text-sm ${
                    order.status === 'DELIVERED' ? 'text-green-600' :
                    order.status === 'CANCELLED' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
