import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps } from '@/types'

interface ExtendedButtonProps extends ButtonProps {
  asChild?: boolean
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ExtendedButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    fullWidth = false,
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asChild = false,
    href,
    ...props
  }, ref) => {
    
    // Utiliser les classes utilitaires personnalisées de globals.css
    const getVariantClass = () => {
      switch (variant) {
        case 'primary':
          return 'btn-primary'
        case 'secondary':
          return 'btn-secondary'
        case 'outline':
          return 'btn-outline'
        case 'ghost':
          return 'btn-ghost'
        case 'danger':
          return 'bg-red-600 text-white hover:bg-red-700 btn'
        default:
          return 'btn-primary'
      }
    }

    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return 'btn-sm'
        case 'lg':
          return 'btn-lg'
        default:
          return '' // Taille par défaut dans btn
      }
    }

    const combinedClassName = cn(
      getVariantClass(),
      getSizeClass(),
      fullWidth && 'w-full',
      className
    )

    // Composant de chargement
    const LoadingSpinner = () => (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
    )

    // Si c'est un lien
    if (href && !disabled) {
      return (
        <a
          href={href}
          className={combinedClassName}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(props as any)}
        >
          {loading && <LoadingSpinner />}
          {children}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={combinedClassName}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button