'use client'

import { useEffect } from 'react'
import { useOrderStore } from '@/store/orderStore'
import { OrderTimeline } from '@/components/orders/OrderStatus'

interface ConnectedOrderTimelineProps {
  orderNumber: string
  className?: string
}

export function ConnectedOrderTimeline({ orderNumber, className }: ConnectedOrderTimelineProps) {
  const { currentTracking, isTrackingLoading, trackOrder } = useOrderStore()

  useEffect(() => {
    trackOrder(orderNumber)
  }, [orderNumber, trackOrder])

  if (isTrackingLoading) {
    return (
      <div className="card p-6 text-center text-gray-600">
        Chargement du suivi...
      </div>
    )
  }

  if (!currentTracking) {
    return (
      <div className="card p-6 text-center text-gray-600">
        Impossible de charger le suivi de la commande
      </div>
    )
  }

  return (
    <OrderTimeline
      currentStatus={currentTracking.status}
      createdAt={currentTracking.createdAt}
      shippedAt={currentTracking.shippedAt}
      deliveredAt={currentTracking.deliveredAt}
      className={className}
    />
  )
}