'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, Calendar, ChevronRight } from 'lucide-react'
import type { Order } from '@/types'
import { formatDate, formatPrice } from '@/lib/utils'
import { OrderStatus } from './OrderStatus'

interface OrderCardProps {
  order: Order
  className?: string
}

export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <Link href={`/account/orders/${order.orderNumber}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className={`card p-6 cursor-pointer ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Commande #{order.orderNumber}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Status */}
        <OrderStatus status={order.status} className="mb-4" />

        {/* Détails */}
        <div className="space-y-2 text-sm">
          {/* Articles */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Articles</span>
            <span className="font-medium">{order.totalItems}</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="font-medium">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* Dates importantes */}
        {order.shippedAt && (
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            Expédiée le {formatDate(order.shippedAt)}
          </div>
        )}
        {order.deliveredAt && (
          <div className="mt-2 text-xs text-success font-medium">
            Livrée le {formatDate(order.deliveredAt)}
          </div>
        )}
      </motion.div>
    </Link>
  )
}