'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ===========================================
// VARIANTS DU BUTTON AVEC CVA
// ===========================================

const buttonVariants = cva(
  // Base styles - communs à tous les variants
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-colors duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
  ],
  {
    variants: {
      variant: {
        // Primary - bouton principal (CTA)
        default: [
          'bg-primary-600 text-white shadow hover:bg-primary-700',
          'focus-visible:ring-primary-500',
          'dark:bg-primary-500 dark:hover:bg-primary-600',
        ],
        
        // Destructive - actions dangereuses (supprimer)
        destructive: [
          'bg-red-600 text-white shadow hover:bg-red-700',
          'focus-visible:ring-red-500',
        ],
        
        // Outline - bouton secondaire
        outline: [
          'border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900',
          'focus-visible:ring-gray-300',
          'dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        ],
        
        // Secondary - bouton ternaire
        secondary: [
          'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200',
          'focus-visible:ring-gray-300',
          'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
        ],
        
        // Ghost - bouton transparent
        ghost: [
          'hover:bg-gray-100 hover:text-gray-900',
          'focus-visible:ring-gray-300',
          'dark:hover:bg-gray-800 dark:hover:text-gray-100',
        ],
        
        // Link - style de lien
        link: [
          'text-primary-600 underline-offset-4 hover:underline',
          'focus-visible:ring-primary-500',
          'dark:text-primary-400',
        ],
        
        // Success - confirmations (ajouter au panier, etc.)
        success: [
          'bg-green-600 text-white shadow hover:bg-green-700',
          'focus-visible:ring-green-500',
        ],
        
        // Warning - actions d'attention
        warning: [
          'bg-orange-600 text-white shadow hover:bg-orange-700',
          'focus-visible:ring-orange-500',
        ],
      },
      
      size: {
        // Tailles responsive mobile-first
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        
        // Icon only buttons
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      loading: false,
    },
  }
)

// ===========================================
// LOADING SPINNER COMPONENT
// ===========================================

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
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
  </svg>
)

// ===========================================
// BUTTON PROPS INTERFACE
// ===========================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Si true, le composant agit comme un Slot pour composition avancée
   */
  asChild?: boolean
  
  /**
   * État de chargement - affiche un spinner et désactive le bouton
   */
  loading?: boolean
  
  /**
   * Texte à afficher pendant le chargement
   */
  loadingText?: string
  
  /**
   * Icône à afficher avant le texte
   */
  startIcon?: React.ReactNode
  
  /**
   * Icône à afficher après le texte
   */
  endIcon?: React.ReactNode
  
  /**
   * Si true, prend toute la largeur disponible
   */
  fullWidth?: boolean
}

// ===========================================
// BUTTON COMPONENT
// ===========================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      startIcon,
      endIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, loading, className })
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <LoadingSpinner className="h-4 w-4" />
        )}
        
        {/* Start icon */}
        {!loading && startIcon && (
          <span className="shrink-0">
            {startIcon}
          </span>
        )}
        
        {/* Button text */}
        <span className={cn(loading && 'opacity-70')}>
          {loading && loadingText ? loadingText : children}
        </span>
        
        {/* End icon */}
        {!loading && endIcon && (
          <span className="shrink-0">
            {endIcon}
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }