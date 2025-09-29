import { forwardRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useToasts, useUIStore } from '@/store'
import type { ToastProps } from '@/types'

interface ExtendedToastProps extends ToastProps {
  onRemove?: (id: string) => void
}

const Toast = forwardRef<HTMLDivElement, ExtendedToastProps>(
  ({ id, type, title, message, duration = 5000, action, onRemove }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
      // Animation d'entrée
      setIsVisible(true)

      // Auto-suppression
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleRemove()
        }, duration)

        return () => clearTimeout(timer)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration])

    const handleRemove = () => {
      setIsLeaving(true)
      setTimeout(() => {
        if (onRemove) {
          onRemove(id)
        }
      }, 300) // Délai pour l'animation de sortie
    }

    const getVariantClasses = () => {
      switch (type) {
        case 'success':
          return {
            container: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
            icon: 'text-green-600 dark:text-green-400',
            title: 'text-green-900 dark:text-green-100',
            message: 'text-green-700 dark:text-green-300'
          }
        case 'error':
          return {
            container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
            icon: 'text-red-600 dark:text-red-400',
            title: 'text-red-900 dark:text-red-100',
            message: 'text-red-700 dark:text-red-300'
          }
        case 'warning':
          return {
            container: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
            icon: 'text-amber-600 dark:text-amber-400',
            title: 'text-amber-900 dark:text-amber-100',
            message: 'text-amber-700 dark:text-amber-300'
          }
        case 'info':
          return {
            container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
            icon: 'text-blue-600 dark:text-blue-400',
            title: 'text-blue-900 dark:text-blue-100',
            message: 'text-blue-700 dark:text-blue-300'
          }
        default:
          return {
            container: 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700',
            icon: 'text-slate-600 dark:text-slate-400',
            title: 'text-slate-900 dark:text-slate-100',
            message: 'text-slate-700 dark:text-slate-300'
          }
      }
    }

    const getIcon = () => {
      switch (type) {
        case 'success':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        case 'error':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        case 'warning':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        case 'info':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        default:
          return null
      }
    }

    const variantClasses = getVariantClasses()

    return (
      <div
        ref={ref}
        className={cn(
          'max-w-sm w-full shadow-lg rounded-lg border pointer-events-auto transition-all duration-300 ease-out',
          variantClasses.container,
          isVisible && !isLeaving 
            ? 'transform translate-x-0 opacity-100' 
            : 'transform translate-x-full opacity-0'
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            {/* Icon */}
            <div className={cn('flex-shrink-0', variantClasses.icon)}>
              {getIcon()}
            </div>

            {/* Content */}
            <div className="ml-3 w-0 flex-1">
              {title && (
                <p className={cn('text-sm font-medium', variantClasses.title)}>
                  {title}
                </p>
              )}
              <p className={cn('text-sm', variantClasses.message, title && 'mt-1')}>
                {message}
              </p>
              
              {/* Action */}
              {action && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'text-sm font-medium underline hover:no-underline',
                      variantClasses.title
                    )}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>

            {/* Close button */}
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                onClick={handleRemove}
                className={cn(
                  'rounded-md inline-flex text-sm hover:opacity-75 transition-opacity',
                  variantClasses.icon
                )}
                aria-label="Fermer"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="w-full bg-black/10 dark:bg-white/10 h-1">
            <div
              className={cn(
                'h-1 transition-all ease-linear',
                type === 'success' ? 'bg-green-600' :
                type === 'error' ? 'bg-red-600' :
                type === 'warning' ? 'bg-amber-600' :
                type === 'info' ? 'bg-blue-600' :
                'bg-slate-600'
              )}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    )
  }
)

// Container pour les toasts
const ToastContainer = () => {
  const toasts = useToasts()
  const removeToast = useUIStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={removeToast}
        />
      ))}
    </div>,
    document.body
  )
}

// Styles CSS pour l'animation de la progress bar
const toastStyles = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = toastStyles
  document.head.appendChild(styleSheet)
}

Toast.displayName = 'Toast'
ToastContainer.displayName = 'ToastContainer'

export default Toast
export { ToastContainer }