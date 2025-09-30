import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'product'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  asLink?: boolean
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

type CardContentProps = HTMLAttributes<HTMLDivElement>
type CardFooterProps = HTMLAttributes<HTMLDivElement>

// Composant principal Card
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      asLink = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Utilise les utilities de globals.css
    const baseClass = variant === 'product' ? 'card-product' : 'card'

    const paddingClass = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }[padding]

    const classes = cn(
      baseClass,
      paddingClass,
      asLink && 'cursor-pointer',
      'h-full flex flex-col', // Hauteur uniforme dans les grids
      className
    )

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={classes}
        role={asLink ? 'button' : undefined}
        tabIndex={asLink ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// Card Header
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className, children, ...props }, ref) => {
    if (!title && !subtitle && !children && !action) return null

    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4 mb-4', className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    )
  }
)

// Card Content
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex-1', className)} {...props}>
        {children}
      </div>
    )
  }
)

// Card Footer
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-4 mt-auto pt-4 border-t border-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'

export default Card
export { CardHeader, CardContent, CardFooter }