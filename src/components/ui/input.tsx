'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

// ===========================================
// VARIANTS DE L'INPUT
// ===========================================

const inputVariants = cva(
  // Base styles
  [
    'flex w-full rounded-md border px-3 py-2 text-sm transition-colors duration-200',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 bg-white text-gray-900',
          'focus:border-primary-500 focus:ring-primary-500/20',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
          'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
        ],
        error: [
          'border-red-300 bg-red-50 text-gray-900',
          'focus:border-red-500 focus:ring-red-500/20',
          'placeholder:text-red-400',
          'dark:border-red-600 dark:bg-red-900/20 dark:text-gray-100',
        ],
        success: [
          'border-green-300 bg-green-50 text-gray-900',
          'focus:border-green-500 focus:ring-green-500/20',
          'dark:border-green-600 dark:bg-green-900/20 dark:text-gray-100',
        ],
        ghost: [
          'border-transparent bg-transparent',
          'focus:border-gray-300 focus:ring-gray-300/20',
          'dark:focus:border-gray-600',
        ],
      },
      
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: true,
    },
  }
)

// ===========================================
// INPUT PROPS INTERFACE
// ===========================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label du champ
   */
  label?: string
  
  /**
   * Message d'erreur à afficher
   */
  error?: string
  
  /**
   * Message d'aide à afficher
   */
  helperText?: string
  
  /**
   * Icône à afficher au début du champ
   */
  startIcon?: React.ReactNode
  
  /**
   * Icône à afficher à la fin du champ
   */
  endIcon?: React.ReactNode
  
  /**
   * État de chargement
   */
  loading?: boolean
  
  /**
   * Container className
   */
  containerClassName?: string
  
  /**
   * Taille native HTML de l'input (largeur en caractères)
   */
  htmlSize?: number
}

// ===========================================
// LOADING SPINNER
// ===========================================

const LoadingSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin text-gray-400"
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
// INPUT COMPONENT
// ===========================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type = 'text',
      variant,
      size,
      fullWidth,
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      loading = false,
      disabled,
      id,
      htmlSize,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputId = id || `input-${React.useId()}`
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    
    // Déterminer la variante en fonction de l'erreur
    const currentVariant = error ? 'error' : variant
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }
    
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium',
              error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
          </label>
        )}
        
        {/* Input container */}
        <div className="relative">
          {/* Start icon */}
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="h-4 w-4 flex items-center justify-center">
                {startIcon}
              </span>
            </div>
          )}
          
          {/* Input field */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: currentVariant, size, fullWidth }),
              {
                'pl-10': startIcon,
                'pr-10': endIcon || loading || isPassword,
              },
              className
            )}
            ref={ref}
            id={inputId}
            size={htmlSize}
            disabled={disabled || loading}
            aria-describedby={
              error ? `${inputId}-error` : 
              helperText ? `${inputId}-description` : 
              undefined
            }
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          
          {/* End icon / Loading / Password toggle */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <LoadingSpinner />
            ) : isPassword ? (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            ) : endIcon ? (
              <span className="h-4 w-4 flex items-center justify-center text-gray-400">
                {endIcon}
              </span>
            ) : null}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        
        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${inputId}-description`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// ===========================================
// TEXTAREA COMPONENT
// ===========================================

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
  /**
   * Taille HTML native du textarea (colonnes)
   */
  htmlCols?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      fullWidth,
      label,
      error,
      helperText,
      id,
      htmlCols,
      rows,
      ...props
    },
    ref
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const textareaId = id || `textarea-${React.useId()}`
    const currentVariant = error ? 'error' : variant
    
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium',
              error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
          </label>
        )}
        
        {/* Textarea */}
        <textarea
          className={cn(
            inputVariants({ variant: currentVariant, size, fullWidth }),
            'min-h-[80px] resize-vertical',
            className
          )}
          ref={ref}
          id={textareaId}
          cols={htmlCols}
          rows={rows}
          aria-describedby={
            error ? `${textareaId}-error` : 
            helperText ? `${textareaId}-description` : 
            undefined
          }
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {/* Error message */}
        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          >
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        
        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${textareaId}-description`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Input, Textarea, inputVariants }