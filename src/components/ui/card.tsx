'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'

// ===========================================
// VARIANTS DE LA CARD
// ===========================================

const cardVariants = cva(
  // Base styles
  [
    'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-200 bg-white shadow-sm',
          'dark:border-gray-800 dark:bg-gray-900',
        ],
        outlined: [
          'border-gray-200 bg-white',
          'dark:border-gray-700 dark:bg-gray-900',
        ],
        elevated: [
          'border-gray-200 bg-white shadow-lg',
          'dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-900/20',
        ],
        ghost: [
          'border-transparent bg-transparent',
        ],
        interactive: [
          'border-gray-200 bg-white shadow-sm cursor-pointer',
          'hover:shadow-md hover:border-gray-300',
          'dark:border-gray-800 dark:bg-gray-900',
          'dark:hover:border-gray-700 dark:hover:shadow-gray-900/20',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        ],
        product: [
          'border-gray-200 bg-white shadow-sm cursor-pointer group overflow-hidden',
          'hover:shadow-lg hover:border-gray-300 hover:-translate-y-1',
          'dark:border-gray-800 dark:bg-gray-900',
          'dark:hover:border-gray-700',
        ],
      },
      
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
)

// ===========================================
// CARD PROPS
// ===========================================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Si true, ajoute un effet de focus et peut être cliqué
   */
  interactive?: boolean
  
  /**
   * Si true, ajoute un effet de hover pour les cartes produits
   */
  asProduct?: boolean
}

// ===========================================
// CARD COMPONENT
// ===========================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      interactive,
      asProduct,
      children,
      ...props
    },
    ref
  ) => {
    // Déterminer la variante automatiquement
    const cardVariant = asProduct ? 'product' : interactive ? 'interactive' : variant
    
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant: cardVariant, padding }), className)}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// ===========================================
// CARD HEADER COMPONENT
// ===========================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Si true, ajoute une bordure en bas
   */
  bordered?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5',
        {
          'border-b border-gray-200 pb-4 dark:border-gray-800': bordered,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

// ===========================================
// CARD TITLE COMPONENT
// ===========================================

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Niveau de heading (h1, h2, etc.)
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Comp = 'h3', children, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
)

CardTitle.displayName = 'CardTitle'

// ===========================================
// CARD DESCRIPTION COMPONENT
// ===========================================

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-gray-600 dark:text-gray-400',
      className
    )}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

// ===========================================
// CARD CONTENT COMPONENT
// ===========================================

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-gray-900 dark:text-gray-100', className)}
    {...props}
  />
))

CardContent.displayName = 'CardContent'

// ===========================================
// CARD FOOTER COMPONENT
// ===========================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Si true, ajoute une bordure en haut
   */
  bordered?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        {
          'border-t border-gray-200 pt-4 dark:border-gray-800': bordered,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'

// ===========================================
// CARD IMAGE COMPONENT (pour produits)
// ===========================================

export interface CardImageProps extends Omit<ImageProps, 'alt'> {
  /**
   * Aspect ratio de l'image
   */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto'
  
  /**
   * Si true, applique un effet zoom au hover
   */
  hover?: boolean

  alt: string 
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      className,
      aspectRatio = 'auto',
      hover = false,
      alt,
      ...props
    },
    ref
  ) => {
    const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      auto: '',
    }
    
    return (
      <div
        className={cn(
          'overflow-hidden',
          aspectClasses[aspectRatio],
          {
            'group-hover:scale-105 transition-transform duration-300': hover,
          }
        )}
      >
        <Image
          ref={ref}
          className={cn(
            'h-full w-full object-cover',
            className
          )}
          alt={alt}
          {...props}
        />
      </div>
    )
  }
)

CardImage.displayName = 'CardImage'

// ===========================================
// CARD BADGE COMPONENT (pour promotions, statuts)
// ===========================================

const cardBadgeVariants = cva(
  'absolute inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        sale: 'bg-red-500 text-white',
        new: 'bg-blue-500 text-white',
        featured: 'bg-purple-500 text-white',
      },
      
      position: {
        'top-left': 'top-2 left-2',
        'top-right': 'top-2 right-2',
        'bottom-left': 'bottom-2 left-2',
        'bottom-right': 'bottom-2 right-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'top-right',
    },
  }
)

export interface CardBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof cardBadgeVariants> {}

const CardBadge = React.forwardRef<HTMLSpanElement, CardBadgeProps>(
  ({ className, variant, position, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(cardBadgeVariants({ variant, position }), className)}
      {...props}
    />
  )
)

CardBadge.displayName = 'CardBadge'

// ===========================================
// PRODUCT CARD SKELETON (pour loading)
// ===========================================

const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn('animate-pulse', className)}
    padding="none"
    {...props}
  >
    {/* Image skeleton */}
    <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
    
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-16" />
      </div>
    </div>
  </Card>
))

CardSkeleton.displayName = 'CardSkeleton'

// ===========================================
// EXPORTS
// ===========================================

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  CardSkeleton,
  cardVariants,
  cardBadgeVariants,
}