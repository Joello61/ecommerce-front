import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      href,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Utilise directement les utilities de globals.css
    const baseClass = 'btn'
    
    const variantClass = {
      primary: 'btn-primary',
      outline: 'btn-outline',
      ghost: 'bg-transparent hover:bg-gray-50 text-gray-700',
      danger: 'bg-danger text-white hover:bg-red-700'
    }[variant]

    const sizeClass = {
      sm: 'text-sm px-3 py-1.5',
      md: '', // Taille par défaut dans .btn
      lg: 'text-base px-6 py-3'
    }[size]

    const classes = cn(
      baseClass,
      variantClass,
      sizeClass,
      fullWidth && 'w-full',
      loading && 'opacity-70 cursor-wait',
      className
    )

    const content = (
      <>
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {leftIcon && <span className="w-5 h-5">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="w-5 h-5">{rightIcon}</span>}
      </>
    )

    if (href && !disabled) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button