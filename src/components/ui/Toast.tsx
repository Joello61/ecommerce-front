import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  type?: 'success' | 'error' | 'warning' | 'info' | 'default'
  title?: string
  message: string
  duration?: number
  action?: ToastAction
  onRemove?: (id: string) => void
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, type = 'default', title, message, duration = 5000, action, onRemove }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
      setIsVisible(true)

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
        if (onRemove) onRemove(id)
      }, 300)
    }

    const variantMap = {
      success: {
        container: 'bg-green-50 border-success/20',
        icon: 'text-success',
        title: 'text-green-900',
        message: 'text-green-700'
      },
      error: {
        container: 'bg-red-50 border-danger/20',
        icon: 'text-danger',
        title: 'text-red-900',
        message: 'text-red-700'
      },
      warning: {
        container: 'bg-amber-50 border-warning/20',
        icon: 'text-warning',
        title: 'text-amber-900',
        message: 'text-amber-700'
      },
      info: {
        container: 'bg-blue-50 border-info/20',
        icon: 'text-info',
        title: 'text-blue-900',
        message: 'text-blue-700'
      },
      default: {
        container: 'bg-white border-gray-200',
        icon: 'text-gray-600',
        title: 'text-gray-900',
        message: 'text-gray-700'
      }
    }

    const icons = {
      success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      default: null
    }

    const variant = variantMap[type]
    const icon = icons[type]

    return (
      <div
        ref={ref}
        className={cn(
          'max-w-sm w-full shadow-lg rounded-lg border pointer-events-auto transition-all duration-300 ease-out',
          variant.container,
          isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            {icon && <div className={cn('flex-shrink-0', variant.icon)}>{icon}</div>}

            <div className={cn('flex-1', icon && 'ml-3')}>
              {title && <p className={cn('text-sm font-medium', variant.title)}>{title}</p>}
              <p className={cn('text-sm', variant.message, title && 'mt-1')}>{message}</p>

              {action && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={action.onClick}
                    className={cn('text-sm font-medium underline hover:no-underline', variant.title)}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className={cn('ml-4 flex-shrink-0 text-sm hover:opacity-75 transition-opacity', variant.icon)}
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {duration > 0 && (
          <div className="w-full bg-black/10 h-1">
            <div
              className={cn(
                'h-1 transition-all ease-linear',
                type === 'success' ? 'bg-success' :
                type === 'error' ? 'bg-danger' :
                type === 'warning' ? 'bg-warning' :
                type === 'info' ? 'bg-info' :
                'bg-gray-600'
              )}
              style={{ animation: `shrink ${duration}ms linear forwards` }}
            />
          </div>
        )}
      </div>
    )
  }
)

// Container pour les toasts
interface ToastContainerProps {
  toasts: ToastProps[]
  removeToast: (id: string) => void
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  )
}

// Injection des styles CSS pour l'animation
if (typeof document !== 'undefined') {
  const styleId = 'toast-animation-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `
    document.head.appendChild(style)
  }
}

Toast.displayName = 'Toast'
ToastContainer.displayName = 'ToastContainer'

export default Toast
export { ToastContainer }
export type { ToastProps, ToastAction }