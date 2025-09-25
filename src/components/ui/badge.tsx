'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ===========================================
// VARIANTS DU BADGE
// ===========================================

const badgeVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-1 rounded-full font-medium transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        // Default - badges neutres
        default: [
          'bg-gray-100 text-gray-800 hover:bg-gray-200',
          'dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
        ],
        
        // Primary - badges d'action
        primary: [
          'bg-primary-100 text-primary-800 hover:bg-primary-200',
          'dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800',
        ],
        
        // Success - commandes validées, stock disponible
        success: [
          'bg-green-100 text-green-800 hover:bg-green-200',
          'dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800',
        ],
        
        // Warning - stock faible, attention
        warning: [
          'bg-orange-100 text-orange-800 hover:bg-orange-200',
          'dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800',
        ],
        
        // Error - erreurs, rupture stock
        error: [
          'bg-red-100 text-red-800 hover:bg-red-200',
          'dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800',
        ],
        
        // Info - informations
        info: [
          'bg-blue-100 text-blue-800 hover:bg-blue-200',
          'dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800',
        ],
        
        // Sale - promotions, soldes
        sale: [
          'bg-red-500 text-white hover:bg-red-600',
          'shadow-sm',
        ],
        
        // New - nouveautés
        new: [
          'bg-blue-500 text-white hover:bg-blue-600',
          'shadow-sm',
        ],
        
        // Featured - produits mis en avant
        featured: [
          'bg-purple-500 text-white hover:bg-purple-600',
          'shadow-sm',
        ],
        
        // Outline variants
        outline: [
          'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
          'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
        ],
        
        'outline-primary': [
          'border border-primary-300 bg-transparent text-primary-700 hover:bg-primary-50',
          'dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-900',
        ],
        
        'outline-success': [
          'border border-green-300 bg-transparent text-green-700 hover:bg-green-50',
          'dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900',
        ],
        
        'outline-error': [
          'border border-red-300 bg-transparent text-red-700 hover:bg-red-50',
          'dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900',
        ],
      },
      
      size: {
        sm: 'px-2 py-0.5 text-xs h-5',
        default: 'px-2.5 py-1 text-xs h-6',
        lg: 'px-3 py-1.5 text-sm h-8',
      },
      
      rounded: {
        default: 'rounded-full',
        sm: 'rounded',
        lg: 'rounded-lg',
      },
      
      interactive: {
        true: 'cursor-pointer select-none',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'default',
      interactive: false,
    },
  }
)

// ===========================================
// BADGE PROPS
// ===========================================

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Icône à afficher avant le texte
   */
  startIcon?: React.ReactNode
  
  /**
   * Icône à afficher après le texte
   */
  endIcon?: React.ReactNode
  
  /**
   * Si true, affiche un bouton de fermeture
   */
  dismissible?: boolean
  
  /**
   * Callback appelé lors de la fermeture
   */
  onDismiss?: () => void
  
  /**
   * Si true, le badge peut être cliqué
   */
  interactive?: boolean
}

// ===========================================
// BADGE COMPONENT
// ===========================================

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      interactive: interactiveProp,
      startIcon,
      endIcon,
      dismissible = false,
      onDismiss,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const interactive = interactiveProp || !!onClick || dismissible
    
    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation()
      onDismiss?.()
    }
    
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, rounded, interactive }),
          className
        )}
        onClick={onClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {/* Start icon */}
        {startIcon && (
          <span className="shrink-0">
            {startIcon}
          </span>
        )}
        
        {/* Badge content */}
        {children && (
          <span className="truncate">
            {children}
          </span>
        )}
        
        {/* End icon */}
        {endIcon && !dismissible && (
          <span className="shrink-0">
            {endIcon}
          </span>
        )}
        
        {/* Dismiss button */}
        {dismissible && (
          <button
            type="button"
            className="shrink-0 hover:opacity-70 focus:opacity-70 transition-opacity"
            onClick={handleDismiss}
            aria-label="Supprimer"
          >
            <svg
              className="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// ===========================================
// STATUS BADGE (pour commandes, stock, etc.)
// ===========================================

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  /**
   * Statut à afficher
   */
  status: 'active' | 'inactive' | 'pending' | 'processing' | 'completed' | 'cancelled' | 'error'
    | 'in_stock' | 'low_stock' | 'out_of_stock'
    | 'paid' | 'unpaid' | 'refunded'
    | 'delivered' | 'shipped' | 'returned'
}

const statusVariants = {
  // Général
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'error',
  error: 'error',
  
  // Stock
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'error',
  
  // Paiement
  paid: 'success',
  unpaid: 'warning',
  refunded: 'info',
  
  // Livraison
  delivered: 'success',
  shipped: 'info',
  returned: 'warning',
} as const

const statusLabels = {
  active: 'Actif',
  inactive: 'Inactif',
  pending: 'En attente',
  processing: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
  error: 'Erreur',
  
  in_stock: 'En stock',
  low_stock: 'Stock faible',
  out_of_stock: 'Rupture',
  
  paid: 'Payé',
  unpaid: 'Non payé',
  refunded: 'Remboursé',
  
  delivered: 'Livré',
  shipped: 'Expédié',
  returned: 'Retourné',
} as const

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    const variant = statusVariants[status] as BadgeProps['variant']
    const label = children || statusLabels[status]
    
    return (
      <Badge
        ref={ref}
        variant={variant}
        {...props}
      >
        {label}
      </Badge>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

// ===========================================
// BADGE GROUP (pour plusieurs badges)
// ===========================================

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Espacement entre les badges
   */
  spacing?: 'sm' | 'default' | 'lg'
  
  /**
   * Direction d'affichage
   */
  direction?: 'row' | 'column'
  
  /**
   * Alignement des badges
   */
  align?: 'start' | 'center' | 'end'
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  (
    {
      className,
      spacing = 'default',
      direction = 'row',
      align = 'start',
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      sm: direction === 'row' ? 'gap-1' : 'gap-1',
      default: direction === 'row' ? 'gap-2' : 'gap-2',
      lg: direction === 'row' ? 'gap-3' : 'gap-3',
    }
    
    const alignClasses = {
      start: 'justify-start items-start',
      center: 'justify-center items-center',
      end: 'justify-end items-end',
    }
    
    const directionClass = direction === 'row' ? 'flex-row flex-wrap' : 'flex-col'
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionClass,
          spacingClasses[spacing],
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

BadgeGroup.displayName = 'BadgeGroup'

// ===========================================
// EXPORTS
// ===========================================

export { Badge, StatusBadge, BadgeGroup, badgeVariants }