// src/components/ui/Textarea.tsx
import { forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { TextareaProps } from '@/types'

interface ExtendedTextareaProps extends Omit<TextareaProps, 'onChange'> {
  id?: string
  name?: string
  label?: string
  helperText?: string
  characterCount?: boolean
  autoResize?: boolean
  minRows?: number
  maxRows?: number
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onChangeEvent?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea = forwardRef<HTMLTextAreaElement, ExtendedTextareaProps>(
  ({
    placeholder,
    value = '',
    onChange,
    onChangeEvent,
    onBlur,
    onFocus,
    error,
    disabled = false,
    required = false,
    maxLength,
    rows = 3,
    resize = 'vertical',
    className,
    id,
    name,
    label,
    helperText,
    characterCount = false,
    autoResize = false,
    minRows = 2,
    maxRows = 10,
    ...props
  }, ref) => {
    
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const inputId = id || name

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current
        
        const adjustHeight = () => {
          textarea.style.height = 'auto'
          const scrollHeight = textarea.scrollHeight
          const minHeight = minRows * 24 // Approximation de la hauteur d'une ligne
          const maxHeight = maxRows * 24
          
          const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
          textarea.style.height = `${newHeight}px`
        }

        adjustHeight()
      }
    }, [value, autoResize, minRows, maxRows])

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(event.target.value, event)
      }
      if (onChangeEvent) {
        onChangeEvent(event)
      }
    }

    const getResizeClass = () => {
      switch (resize) {
        case 'none':
          return 'resize-none'
        case 'horizontal':
          return 'resize-x'
        case 'both':
          return 'resize'
        default:
          return 'resize-y'
      }
    }

    // Classes pour le textarea en utilisant les mêmes styles que Input
    const textareaClassName = cn(
      'flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400',
      error && 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400',
      getResizeClass(),
      autoResize && 'overflow-hidden',
      className
    )

    const currentLength = value?.toString().length || 0
    const showCharacterCount = characterCount && maxLength

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

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={(element) => {
              if (ref) {
                if (typeof ref === 'function') {
                  ref(element)
                } else {
                  ref.current = element
                }
              }
              textareaRef.current = element
            }}
            id={inputId}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={autoResize ? minRows : rows}
            className={textareaClassName}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : 
              helperText ? `${inputId}-helper` : 
              undefined
            }
            {...props}
          />

          {/* Character Count */}
          {showCharacterCount && (
            <div className="absolute bottom-2 right-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1 rounded">
              <span className={cn(
                maxLength && currentLength > maxLength * 0.9 && 'text-amber-600',
                maxLength && currentLength >= maxLength && 'text-red-600'
              )}>
                {currentLength}
              </span>
              {maxLength && (
                <span>/{maxLength}</span>
              )}
            </div>
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

        {/* Character count as helper text (alternative position) */}
        {characterCount && !showCharacterCount && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-right">
            {currentLength}{maxLength && ` / ${maxLength}`} caractères
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea