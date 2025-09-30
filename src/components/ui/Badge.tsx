import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      icon,
      removable = false,
      onRemove,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Utilise l'utility .badge de globals.css
    const baseClass = 'badge'

    const variantClass = {
      success: 'badge-success',
      warning: 'bg-warning/10 text-warning',
      danger: 'bg-danger/10 text-danger',
      info: 'bg-info/10 text-info',
      default: 'bg-gray-100 text-gray-700'
    }[variant]

    const sizeClass = {
      sm: 'text-xs px-2 py-0.5',
      md: '', // Taille par défaut dans .badge
      lg: 'text-sm px-4 py-1.5'
    }[size]

    const classes = cn(
      baseClass,
      variantClass,
      sizeClass,
      dot && 'pl-6',
      className
    )

    return (
      <span ref={ref} className={classes} {...props}>
        {dot && (
          <span 
            className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-current" 
            aria-hidden="true"
          />
        )}
        
        {icon && <span className="w-3.5 h-3.5 flex-shrink-0">{icon}</span>}
        
        <span className="truncate">{children}</span>
        
        {removable && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="ml-1.5 w-3.5 h-3.5 flex-shrink-0 rounded-full hover:bg-black/10 transition-colors flex items-center justify-center"
            aria-label="Retirer"
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge