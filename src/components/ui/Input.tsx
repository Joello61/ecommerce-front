import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leftAddon?: string
  rightAddon?: string
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      required = false,
      disabled = false,
      maxLength,
      type = 'text',
      value,
      onChange,
      className,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).slice(2, 9)}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value, e)
      }
    }

    const inputClasses = cn(
      'input',
      error && 'border-danger focus:border-danger focus:shadow-none',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      leftAddon && 'rounded-l-none border-l-0',
      rightAddon && 'rounded-r-none border-r-0',
      disabled && 'opacity-60 cursor-not-allowed',
      className
    )

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <div className="flex">
          {leftAddon && (
            <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {leftAddon}
            </span>
          )}

          <div className="relative flex-1">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="w-5 h-5 text-gray-400">{leftIcon}</div>
              </div>
            )}

            <input
              ref={ref}
              type={type}
              id={inputId}
              name={name}
              disabled={disabled}
              required={required}
              maxLength={maxLength}
              value={value}
              onChange={handleChange}
              className={inputClasses}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...props}
            />

            {rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-5 h-5 text-gray-400">{rightIcon}</div>
              </div>
            )}
          </div>

          {rightAddon && (
            <span className="inline-flex items-center px-3 rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 text-sm">
              {rightAddon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input