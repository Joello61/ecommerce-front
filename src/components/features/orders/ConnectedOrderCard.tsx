'use client'

import { OrderCard } from '@/components/orders/OrderCard'
import type { Order } from '@/types'

interface ConnectedOrderCardProps {
  order: Order
  className?: string
}

export function ConnectedOrderCard({ order, className }: ConnectedOrderCardProps) {
  // Pour l'instant, pas de logique supplémentaire nécessaire
  // Le OrderCard gère déjà la navigation via Link
  
  return (
    <OrderCard
      order={order}
      className={className}
    />
  )
}