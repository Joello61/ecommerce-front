'use client'

import { OrderStatus } from '@/components/orders/OrderStatus'
import type { OrderStatus as OrderStatusType } from '@/types'

interface ConnectedOrderStatusProps {
  status: OrderStatusType
  showLabel?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ConnectedOrderStatus(props: ConnectedOrderStatusProps) {
  // Pas de logique connectée nécessaire, c'est juste un badge visuel
  return <OrderStatus {...props} />
}