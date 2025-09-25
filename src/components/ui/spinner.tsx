'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ===========================================
// VARIANTS DU SPINNER
// ===========================================

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      
      variant: {
        default: 'text-gray-600 dark:text-gray-400',
        primary: 'text-primary-600 dark:text-primary-400',
        white: 'text-white',
        current: 'text-current',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
)

// ===========================================
// SPINNER PROPS
// ===========================================

export interface SpinnerProps
  extends React.SVGAttributes<SVGElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Texte de description pour l'accessibilité
   */
  label?: string
}

// ===========================================
// SPINNER COMPONENT
// ===========================================

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  (
    {
      className,
      size,
      variant,
      label = 'Chargement en cours',
      ...props
    },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label={label}
        role="status"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
        <span className="sr-only">{label}</span>
      </svg>
    )
  }
)

Spinner.displayName = 'Spinner'

// ===========================================
// DOTS SPINNER (alternative)
// ===========================================

export interface DotsSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

const DotsSpinner = React.forwardRef<HTMLDivElement, DotsSpinnerProps>(
  (
    {
      className,
      size,
      variant,
      label = 'Chargement en cours',
      ...props
    },
    ref
  ) => {
    const dotSizes = {
      sm: 'h-1 w-1',
      default: 'h-2 w-2',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    }
    
    const gaps = {
      sm: 'gap-1',
      default: 'gap-1.5',
      lg: 'gap-2',
      xl: 'gap-3',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          gaps[size || 'default'],
          className
        )}
        role="status"
        aria-label={label}
        {...props}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-pulse',
              dotSizes[size || 'default'],
              spinnerVariants({ variant, size: undefined })
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s',
              backgroundColor: 'currentColor',
            }}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)

DotsSpinner.displayName = 'DotsSpinner'

// ===========================================
// LOADING OVERLAY (pour les conteneurs)
// ===========================================

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Si true, affiche l'overlay de chargement
   */
  loading: boolean
  
  /**
   * Message à afficher sous le spinner
   */
  message?: string
  
  /**
   * Type de spinner à utiliser
   */
  spinnerType?: 'default' | 'dots'
  
  /**
   * Taille du spinner
   */
  spinnerSize?: VariantProps<typeof spinnerVariants>['size']
  
  /**
   * Si true, l'overlay couvre tout l'écran (fixed)
   */
  fullscreen?: boolean
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      className,
      loading,
      message,
      spinnerType = 'default',
      spinnerSize = 'lg',
      fullscreen = false,
      children,
      ...props
    },
    ref
  ) => {
    if (!loading) {
      return <>{children}</>
    }
    
    const SpinnerComponent = spinnerType === 'dots' ? DotsSpinner : Spinner
    
    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {/* Contenu original (en arrière-plan) */}
        <div className={loading ? 'opacity-50' : ''}>
          {children}
        </div>
        
        {/* Overlay de chargement */}
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-4',
            'bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm',
            fullscreen
              ? 'fixed inset-0 z-50'
              : 'absolute inset-0 z-10'
          )}
        >
          <SpinnerComponent
            size={spinnerSize}
            variant="primary"
          />
          
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }
)

LoadingOverlay.displayName = 'LoadingOverlay'

// ===========================================
// PULSE SKELETON (pour le contenu qui se charge)
// ===========================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Largeur du skeleton
   */
  width?: string | number
  
  /**
   * Hauteur du skeleton
   */
  height?: string | number
  
  /**
   * Si true, affiche un skeleton circulaire
   */
  circle?: boolean
  
  /**
   * Nombre de lignes à afficher
   */
  lines?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      width,
      height = '1rem',
      circle = false,
      lines = 1,
      style,
      ...props
    },
    ref
  ) => {
    if (lines > 1) {
      return (
        <div className={cn('space-y-2', className)} ref={ref} {...props}>
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded"
              style={{
                height,
                width: i === lines - 1 ? '75%' : width || '100%',
                ...style,
              }}
            />
          ))}
        </div>
      )
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-800',
          circle ? 'rounded-full' : 'rounded',
          className
        )}
        style={{
          width: circle ? height : width,
          height,
          ...style,
        }}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// ===========================================
// EXPORTS
// ===========================================

export { Spinner, DotsSpinner, LoadingOverlay, Skeleton, spinnerVariants }