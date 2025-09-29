import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { BaseComponentProps } from '@/types'

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'product' | 'feature'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

interface CardHeaderProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

type CardContentProps = BaseComponentProps

type CardFooterProps = BaseComponentProps

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    padding = 'md',
    hover = false,
    clickable = false,
    onClick,
    className,
    children,
    ...props
  }, ref) => {
    
    const getVariantClass = () => {
      switch (variant) {
        case 'product':
          return 'card-product'
        case 'feature':
          return 'card-feature'
        default:
          return 'card'
      }
    }

    const getPaddingClass = () => {
      if (variant === 'feature') return '' // feature a déjà son padding
      
      switch (padding) {
        case 'none':
          return ''
        case 'sm':
          return 'p-3'
        case 'lg':
          return 'p-8'
        default:
          return 'p-6'
      }
    }

    const cardClassName = cn(
      getVariantClass(),
      getPaddingClass(),
      clickable && 'cursor-pointer',
      hover && !variant.includes('card-') && 'hover:shadow-lg hover:-translate-y-1',
      className
    )

    return (
      <div
        ref={ref}
        onClick={clickable ? onClick : undefined}
        className={cardClassName}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between mb-4', className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    )
  }
)

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700', className)}
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