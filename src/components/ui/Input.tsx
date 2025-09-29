import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { InputProps } from '@/types'

interface ExtendedInputProps extends Omit<InputProps, 'onChange'> {
  id?: string
  name?: string
  label?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leftAddon?: string
  rightAddon?: string
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeEvent?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = forwardRef<HTMLInputElement, ExtendedInputProps>(
  ({
    type = 'text',
    placeholder,
    value,
    onChange,
    onChangeEvent,
    onBlur,
    onFocus,
    error,
    disabled = false,
    required = false,
    autoComplete,
    maxLength,
    min,
    max,
    step,
    className,
    id,
    name,
    label,
    helperText,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    ...props
  }, ref) => {
    
    const inputId = id || name

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value, event)
      }
      if (onChangeEvent) {
        onChangeEvent(event)
      }
    }

    // Classes pour l'input en utilisant les utilitaires personnalisés
    const inputClassName = cn(
      error ? 'input-error' : 'input',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      leftAddon && 'rounded-l-none',
      rightAddon && 'rounded-r-none',
      className
    )

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Container pour les addons et input */}
        <div className="relative flex">
          {/* Left Addon */}
          {leftAddon && (
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {leftAddon}
            </span>
          )}

          {/* Input Container */}
          <div className="relative flex-1">
            {/* Left Icon */}
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="h-5 w-5 text-slate-400">
                  {leftIcon}
                </div>
              </div>
            )}

            {/* Input */}
            <input
              ref={ref}
              type={type}
              id={inputId}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={disabled}
              required={required}
              autoComplete={autoComplete}
              maxLength={maxLength}
              min={min}
              max={max}
              step={step}
              className={inputClassName}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${inputId}-error` : 
                helperText ? `${inputId}-helper` : 
                undefined
              }
              {...props}
            />

            {/* Right Icon */}
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="h-5 w-5 text-slate-400">
                  {rightIcon}
                </div>
              </div>
            )}
          </div>

          {/* Right Addon */}
          {rightAddon && (
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-slate-300 bg-slate-50 text-slate-500 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {rightAddon}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input