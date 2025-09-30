import { forwardRef, useEffect, useRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  helperText?: string
  error?: string
  showCount?: boolean
  autoResize?: boolean
  minRows?: number
  maxRows?: number
  onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      showCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      disabled = false,
      required = false,
      maxLength,
      rows = 3,
      value = '',
      onChange,
      className,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const inputId = id || name

    // Auto-resize
    useEffect(() => {
      if (!autoResize || !textareaRef.current) return

      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const minHeight = minRows * 24
      const maxHeight = maxRows * 24
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)
      textarea.style.height = `${newHeight}px`
    }, [value, autoResize, minRows, maxRows])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value, e)
      }
    }

    const currentLength = value?.toString().length || 0

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={(el) => {
              if (ref) {
                if (typeof ref === 'function') ref(el)
                else ref.current = el
              }
              textareaRef.current = el
            }}
            id={inputId}
            name={name}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            rows={autoResize ? minRows : rows}
            value={value}
            onChange={handleChange}
            className={cn(
              'input',
              error && 'border-danger',
              autoResize ? 'resize-none overflow-hidden' : 'resize-y',
              'min-h-[5rem]',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {showCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded">
              <span className={cn(currentLength > maxLength * 0.9 && 'text-warning', currentLength >= maxLength && 'text-danger')}>
                {currentLength}
              </span>
              <span>/{maxLength}</span>
            </div>
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

        {showCount && !maxLength && (
          <p className="mt-1.5 text-xs text-gray-500 text-right">{currentLength} caractères</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea