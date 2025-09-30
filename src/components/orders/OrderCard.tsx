'use client'

import Link from 'next/link'
import { Package, Calendar, ChevronRight } from 'lucide-react'
import { OrderStatus } from './OrderStatus'
import { cn, formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

interface OrderCardProps {
  order: Order
  className?: string
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <Link href={`/account/orders/${order.orderNumber}`} className={cn('block h-full', className)}>
      <div className="card p-6 h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                Commande #{order.orderNumber}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        </div>

        {/* Status */}
        <div className="mb-4">
          <OrderStatus status={order.status} />
        </div>

        {/* Détails */}
        <div className="space-y-2 text-sm flex-1">
          {/* Articles */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Articles</span>
            <span className="font-medium text-gray-900">{order.totalItems}</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="font-medium text-gray-900">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* Dates importantes */}
        {(order.shippedAt || order.deliveredAt) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {order.shippedAt && (
              <div className="text-xs text-gray-600">
                Expédiée le {formatDate(order.shippedAt)}
              </div>
            )}
            {order.deliveredAt && (
              <div className="mt-2 text-xs text-success font-medium">
                Livrée le {formatDate(order.deliveredAt)}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}