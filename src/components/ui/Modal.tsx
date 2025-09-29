import { forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import Button from './Button'
import type { ModalProps } from '@/types'

interface ExtendedModalProps extends ModalProps {
  footer?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  variant?: 'default' | 'danger' | 'success'
}

const Modal = forwardRef<HTMLDivElement, ExtendedModalProps>(
  ({
    isOpen,
    onClose,
    title,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    footer,
    confirmText,
    cancelText = 'Annuler',
    onConfirm,
    onCancel,
    loading = false,
    variant = 'default',
    className,
    children,
    ...props
  }, ref) => {
    
    // Gestion de l'échappement
    useEffect(() => {
      if (!closeOnEscape) return

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    // Gestion du scroll du body
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    if (!isOpen) return null

    const getSizeClass = () => {
      switch (size) {
        case 'sm':
          return 'max-w-md'
        case 'lg':
          return 'max-w-2xl'
        case 'xl':
          return 'max-w-4xl'
        case 'full':
          return 'max-w-7xl mx-4'
        default:
          return 'max-w-lg'
      }
    }

    const getVariantClasses = () => {
      switch (variant) {
        case 'danger':
          return {
            header: 'border-red-200 dark:border-red-800',
            title: 'text-red-900 dark:text-red-100'
          }
        case 'success':
          return {
            header: 'border-green-200 dark:border-green-800',
            title: 'text-green-900 dark:text-green-100'
          }
        default:
          return {
            header: 'border-slate-200 dark:border-slate-700',
            title: 'text-slate-900 dark:text-slate-100'
          }
      }
    }

    const variantClasses = getVariantClasses()

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose()
      }
    }

    const handleCancel = () => {
      if (onCancel) {
        onCancel()
      } else {
        onClose()
      }
    }

    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div
          ref={ref}
          className={cn(
            'relative w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl transform transition-all',
            getSizeClass(),
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={cn(
              'flex items-center justify-between p-6 border-b',
              variantClasses.header
            )}>
              {title && (
                <h2 className={cn(
                  'text-lg font-semibold',
                  variantClasses.title
                )}>
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                  aria-label="Fermer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {(footer || confirmText || onConfirm) && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              {footer || (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    {cancelText}
                  </Button>
                  
                  {(confirmText || onConfirm) && (
                    <Button
                      variant={variant === 'danger' ? 'danger' : 'primary'}
                      onClick={onConfirm}
                      loading={loading}
                      disabled={loading}
                    >
                      {confirmText || 'Confirmer'}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    )

    return createPortal(modalContent, document.body)
  }
)

// Composant pour les dialogues de confirmation
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'success' | 'default'
  loading?: boolean
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  loading = false
}: ConfirmDialogProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      loading={loading}
    >
      <p className="text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </Modal>
  )
}

Modal.displayName = 'Modal'
ConfirmDialog.displayName = 'ConfirmDialog'

export default Modal
export { ConfirmDialog }