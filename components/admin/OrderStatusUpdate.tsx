'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Error updating status');
      }

      toast.success(`Estado actualizado a ${statusLabels[newStatus]}`);
      window.location.reload();
    } catch (err) {
      toast.error('Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleUpdate(e.target.value)}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {statusLabels[status]}
        </option>
      ))}
    </select>
  );
}
