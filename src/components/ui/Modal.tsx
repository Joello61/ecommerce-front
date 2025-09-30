import { forwardRef, useEffect, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import Button from './Button'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  showClose?: boolean
  footer?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  variant?: 'default' | 'danger' | 'success'
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      closeOnOverlay = true,
      closeOnEscape = true,
      showClose = true,
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
    },
    ref
  ) => {
    // Gestion échappement + scroll body
    useEffect(() => {
      if (!isOpen) return

      const handleEscape = (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') onClose()
      }

      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }, [isOpen, closeOnEscape, onClose])

    if (!isOpen) return null

    const sizeMap = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-7xl mx-4'
    }

    const variantMap = {
      default: { border: 'border-gray-200', title: 'text-gray-900' },
      danger: { border: 'border-danger/20', title: 'text-danger' },
      success: { border: 'border-success/20', title: 'text-success' }
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) onClose()
    }

    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div
          ref={ref}
          className={cn('card w-full shadow-xl transform transition-all', sizeMap[size], className)}
          {...props}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className={cn('flex items-center justify-between p-6 border-b', variantMap[variant].border)}>
              {title && <h2 className={cn('text-lg font-semibold', variantMap[variant].title)}>{title}</h2>}
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  aria-label="Fermer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {(footer || confirmText || onConfirm) && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              {footer || (
                <>
                  <Button variant="outline" onClick={onCancel || onClose} disabled={loading}>
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

// Dialogue de confirmation simplifié
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
}: ConfirmDialogProps) => (
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
    <p className="text-gray-600">{message}</p>
  </Modal>
)

Modal.displayName = 'Modal'
ConfirmDialog.displayName = 'ConfirmDialog'

export default Modal
export { ConfirmDialog }