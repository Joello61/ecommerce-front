import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { BaseComponentProps } from '@/types'

interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    variant = 'primary',
    size = 'md',
    dot = false,
    icon,
    removable = false,
    onRemove,
    className,
    children,
    ...props
  }, ref) => {
    
    const getVariantClass = () => {
      switch (variant) {
        case 'primary':
          return 'badge-primary'
        case 'secondary':
          return 'badge-secondary'
        case 'success':
          return 'badge-success'
        case 'warning':
          return 'badge-warning'
        case 'danger':
          return 'badge-danger'
        case 'info':
          return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 badge'
        default:
          return 'badge-primary'
      }
    }

    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return 'px-2 py-1 text-xs'
        case 'lg':
          return 'px-4 py-2 text-sm'
        default:
          return '' // Taille par défaut dans badge
      }
    }

    const badgeClassName = cn(
      getVariantClass(),
      getSizeClass(),
      dot && 'pl-5 relative',
      className
    )

    return (
      <span
        ref={ref}
        className={badgeClassName}
        {...props}
      >
        {/* Dot indicator */}
        {dot && (
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-current opacity-75" />
        )}

        {/* Icon */}
        {icon && (
          <span className="mr-1 h-3 w-3">
            {icon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 h-3 w-3 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Supprimer"
          >
            <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge