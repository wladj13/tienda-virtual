import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice, parseImages } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { OrderStatusUpdate } from '@/components/admin/OrderStatusUpdate';

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: { include: { product: true } },
    },
  });
  if (!order) return null;

  // Parse images for each order item product
  const orderItemsWithImages = order.orderItems.map((item) => ({
    ...item,
    product: item.product
      ? { ...item.product, images: parseImages(item.product.images) }
      : null,
  }));

  return { ...order, orderItems: orderItemsWithImages };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-slate-100 text-slate-700',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const shipping = order.shippingAddress as any;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedido {order.orderNumber}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: es })}
          </p>
        </div>
        <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold">Productos</h2>
            </div>
            <div className="divide-y">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-16 w-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.name || ''}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name || 'Producto eliminado'}</p>
                    <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(Number(item.total))}</p>
                    <p className="text-sm text-slate-500">{formatPrice(Number(item.price))} c/u</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t px-6 py-4 bg-slate-50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Envío</span>
                <span>{order.shipping > 0 ? formatPrice(Number(order.shipping)) : 'Gratis'}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold">Dirección de envío</h2>
            </div>
            <div className="px-6 py-4">
              <p className="font-medium">
                {shipping.firstName} {shipping.lastName}
              </p>
              {shipping.company && <p>{shipping.company}</p>}
              <p>{shipping.address1}</p>
              {shipping.address2 && <p>{shipping.address2}</p>}
              <p>
                {shipping.city}, {shipping.state} {shipping.postal}
              </p>
              <p>{shipping.country}</p>
              {shipping.phone && <p className="mt-2 text-slate-500">Tel: {shipping.phone}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-semibold mb-2">Estado del pedido</h2>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-semibold mb-2">Cliente</h2>
            {order.user ? (
              <>
                <p className="text-sm">{order.user.name || 'Nombre no registrado'}</p>
                <p className="text-sm text-slate-500">{order.user.email}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Cliente guest</p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-semibold mb-2">Pago</h2>
            <p className="text-sm capitalize">{order.paymentMethod || 'Tarjeta'}</p>
            {order.paymentIntentId && (
              <p className="text-xs text-slate-500 mt-1">ID: {order.paymentIntentId}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
