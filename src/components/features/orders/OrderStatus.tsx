'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle, Package, Truck, XCircle, AlertCircle } from 'lucide-react'
import type { OrderStatus as OrderStatusType } from '@/types'
import { cn } from '@/lib/utils'

interface OrderStatusProps {
  status: OrderStatusType
  showLabel?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'text-warning bg-warning/10 border-warning/20',
  },
  confirmed: {
    label: 'Confirmée',
    icon: CheckCircle,
    color: 'text-info bg-info/10 border-info/20',
  },
  processing: {
    label: 'En préparation',
    icon: Package,
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  shipped: {
    label: 'Expédiée',
    icon: Truck,
    color: 'text-secondary bg-secondary/10 border-secondary/20',
  },
  delivered: {
    label: 'Livrée',
    icon: CheckCircle,
    color: 'text-success bg-success/10 border-success/20',
  },
  cancelled: {
    label: 'Annulée',
    icon: XCircle,
    color: 'text-danger bg-danger/10 border-danger/20',
  },
} as const

export function OrderStatus({ 
  status, 
  showLabel = true, 
  showIcon = true,
  size = 'md',
  className 
}: OrderStatusProps) {
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showLabel && <span>{config.label}</span>}
    </motion.div>
  )
}

// Composant de timeline pour afficher la progression
interface OrderTimelineProps {
  currentStatus: OrderStatusType
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
  className?: string
}

export function OrderTimeline({ 
  currentStatus, 
  createdAt,
  shippedAt,
  deliveredAt,
  className 
}: OrderTimelineProps) {
  const steps = [
    { status: 'pending' as OrderStatusType, label: 'Commande passée', date: createdAt },
    { status: 'confirmed' as OrderStatusType, label: 'Confirmée', date: createdAt },
    { status: 'processing' as OrderStatusType, label: 'En préparation', date: null },
    { status: 'shipped' as OrderStatusType, label: 'Expédiée', date: shippedAt },
    { status: 'delivered' as OrderStatusType, label: 'Livrée', date: deliveredAt },
  ]

  const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentIndex = statusOrder.indexOf(currentStatus)

  return (
    <div className={cn('space-y-4', className)}>
      {steps.map((step, index) => {
        const config = statusConfig[step.status]
        const Icon = config.icon
        const isCompleted = index <= currentIndex && currentStatus !== 'cancelled'
        const isCurrent = index === currentIndex && currentStatus !== 'cancelled'
        const isCancelled = currentStatus === 'cancelled' && index === 0

        return (
          <div key={step.status} className="relative flex gap-4">
            {/* Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-4 top-8 bottom-0 w-0.5 -translate-x-1/2',
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                isCompleted
                  ? 'border-primary bg-primary text-white'
                  : isCurrent
                  ? 'border-primary bg-background text-primary'
                  : isCancelled
                  ? 'border-danger bg-danger text-white'
                  : 'border-border bg-muted text-muted-foreground'
              )}
            >
              {isCancelled ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <p
                className={cn(
                  'font-medium',
                  isCompleted || isCurrent
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              {step.date && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {new Date(step.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        )
      })}

      {/* Cancelled status */}
      {currentStatus === 'cancelled' && (
        <div className="flex gap-4 p-4 bg-danger/10 rounded-lg border border-danger/20">
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-danger">Commande annulée</p>
            <p className="text-sm text-muted-foreground mt-1">
              Cette commande a été annulée et ne sera pas livrée.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}