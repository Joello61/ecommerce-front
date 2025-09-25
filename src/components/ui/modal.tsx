'use client'

import * as React from 'react'
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'

// ===========================================
// VARIANTS DU MODAL
// ===========================================

const modalVariants = cva(
  // Base styles
  [
    'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all',
    'dark:bg-gray-900',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        full: 'max-w-full mx-4',
      },
      
      centered: {
        true: 'sm:my-8 sm:w-full sm:max-w-lg sm:mx-auto',
        false: 'sm:my-8 sm:w-full sm:mx-auto',
      },
    },
    defaultVariants: {
      size: 'default',
      centered: true,
    },
  }
)

// ===========================================
// ANIMATIONS
// ===========================================

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariantAnimations = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

// ===========================================
// MODAL PROPS
// ===========================================

export interface ModalProps
  extends VariantProps<typeof modalVariants> {
  /**
   * Si true, le modal est ouvert
   */
  open: boolean
  
  /**
   * Callback appelé lors de la fermeture
   */
  onClose: () => void
  
  /**
   * Titre du modal
   */
  title?: React.ReactNode
  
  /**
   * Description du modal
   */
  description?: React.ReactNode
  
  /**
   * Contenu du modal
   */
  children: React.ReactNode
  
  /**
   * Actions du modal (footer)
   */
  actions?: React.ReactNode
  
  /**
   * Si true, affiche le bouton de fermeture
   */
  showCloseButton?: boolean
  
  /**
   * Si true, ferme le modal en cliquant sur l'overlay
   */
  closeOnOverlayClick?: boolean
  
  /**
   * Si true, ferme le modal avec la touche Escape
   */
  closeOnEscape?: boolean
  
  /**
   * Classe CSS pour le contenu du modal
   */
  contentClassName?: string
  
  /**
   * Classe CSS pour l'overlay
   */
  overlayClassName?: string
  
  /**
   * Si true, le modal ne peut pas être fermé
   */
  persistent?: boolean
  
  /**
   * Position initiale du modal
   */
  initialFocus?: React.RefObject<HTMLElement>
}

// ===========================================
// MODAL COMPONENT
// ===========================================

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      actions,
      size,
      centered,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      contentClassName,
      overlayClassName,
      persistent = false,
      initialFocus,
    },
    ref
  ) => {
    const handleClose = React.useCallback(() => {
      if (!persistent) {
        onClose()
      }
    }, [persistent, onClose])
    
    const handleOverlayClick = React.useCallback(() => {
      if (closeOnOverlayClick) {
        handleClose()
      }
    }, [closeOnOverlayClick, handleClose])
    
    const handleEscapePress = React.useCallback((event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        handleClose()
      }
    }, [closeOnEscape, handleClose])
    
    React.useEffect(() => {
      if (open && closeOnEscape) {
        document.addEventListener('keydown', handleEscapePress)
        return () => document.removeEventListener('keydown', handleEscapePress)
      }
    }, [open, handleEscapePress, closeOnEscape])
    
    return (
      <AnimatePresence>
        {open && (
          <Dialog
            as={motion.div}
            static
            open={open}
            onClose={handleClose}
            className="relative z-50"
            initialFocus={initialFocus}
          >
            {/* Overlay */}
            <motion.div
              className={cn(
                'fixed inset-0 bg-black/50 backdrop-blur-sm',
                overlayClassName
              )}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
            
            {/* Modal container */}
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                  as={motion.div}
                  ref={ref}
                  className={cn(
                    modalVariants({ size, centered }),
                    contentClassName
                  )}
                  variants={modalVariantAnimations}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  {(title || description || showCloseButton) && (
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-900">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {title && (
                            <DialogTitle
                              as="h3"
                              className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </DialogTitle>
                          )}
                          
                          {description && (
                            <Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {description}
                            </Description>
                          )}
                        </div>
                        
                        {/* Close button */}
                        {showCloseButton && !persistent && (
                          <button
                            type="button"
                            className={cn(
                              'ml-4 rounded-md bg-white text-gray-400 hover:text-gray-500',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                              'dark:bg-gray-900 dark:text-gray-500 dark:hover:text-gray-400'
                            )}
                            onClick={handleClose}
                            aria-label="Fermer"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 dark:bg-gray-900">
                    {children}
                  </div>
                  
                  {/* Actions */}
                  {actions && (
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-800">
                      {actions}
                    </div>
                  )}
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    )
  }
)

Modal.displayName = 'Modal'

// ===========================================
// MODAL HOOK (pour faciliter l'utilisation)
// ===========================================

function useModal() {
  const [open, setOpen] = React.useState(false)
  
  const openModal = React.useCallback(() => setOpen(true), [])
  const closeModal = React.useCallback(() => setOpen(false), [])
  const toggleModal = React.useCallback(() => setOpen(prev => !prev), [])
  
  return {
    open,
    openModal,
    closeModal,
    toggleModal,
  }
}

// ===========================================
// CONFIRMATION MODAL
// ===========================================

export interface ConfirmationModalProps extends Omit<ModalProps, 'children'> {
  /**
   * Message de confirmation
   */
  message: React.ReactNode
  
  /**
   * Texte du bouton de confirmation
   */
  confirmText?: string
  
  /**
   * Texte du bouton d'annulation
   */
  cancelText?: string
  
  /**
   * Type de confirmation (influence les couleurs)
   */
  type?: 'info' | 'warning' | 'error' | 'success'
  
  /**
   * Callback appelé lors de la confirmation
   */
  onConfirm: () => void
  
  /**
   * État de chargement du bouton de confirmation
   */
  loading?: boolean
}

const ConfirmationModal = React.forwardRef<HTMLDivElement, ConfirmationModalProps>(
  (
    {
      open,
      onClose,
      onConfirm,
      title,
      message,
      confirmText = 'Confirmer',
      cancelText = 'Annuler',
      type = 'info',
      loading = false,
      ...props
    },
    ref
  ) => {
    const buttonVariants = {
      info: 'bg-primary-600 hover:bg-primary-700 text-white',
      warning: 'bg-orange-600 hover:bg-orange-700 text-white',
      error: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
    }
    
    const handleConfirm = async () => {
      await onConfirm()
      if (!loading) {
        onClose()
      }
    }
    
    const actions = (
      <div className="flex gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-gray-600"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </button>
        
        <button
          type="button"
          className={cn(
            'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:w-auto',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            buttonVariants[type]
          )}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    )
    
    return (
      <Modal
        ref={ref}
        open={open}
        onClose={onClose}
        title={title}
        actions={actions}
        size="sm"
        persistent={loading}
        {...props}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </Modal>
    )
  }
)

ConfirmationModal.displayName = 'ConfirmationModal'

// ===========================================
// DRAWER (modal depuis le côté)
// ===========================================

export interface DrawerProps extends Omit<ModalProps, 'size' | 'centered'> {
  /**
   * Position du drawer
   */
  position?: 'left' | 'right' | 'top' | 'bottom'
  
  /**
   * Largeur du drawer (pour left/right)
   */
  width?: string | number
  
  /**
   * Hauteur du drawer (pour top/bottom)
   */
  height?: string | number
}

const drawerVariants = {
  left: {
    hidden: { x: '-100%' },
    visible: { x: 0 },
    exit: { x: '-100%' },
  },
  right: {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  },
  top: {
    hidden: { y: '-100%' },
    visible: { y: 0 },
    exit: { y: '-100%' },
  },
  bottom: {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' },
  },
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      position = 'right',
      width = '320px',
      height = '50vh',
      children,
      title,
      showCloseButton = true,
      closeOnOverlayClick = true,
      overlayClassName,
      contentClassName,
      persistent = false,
      ...props
    },
    ref
  ) => {
    const handleClose = React.useCallback(() => {
      if (!persistent) {
        onClose()
      }
    }, [persistent, onClose])
    
    const isHorizontal = position === 'left' || position === 'right'
    const drawerSize = isHorizontal ? { width } : { height }
    
    const positionClasses = {
      left: 'inset-y-0 left-0',
      right: 'inset-y-0 right-0',
      top: 'inset-x-0 top-0',
      bottom: 'inset-x-0 bottom-0',
    }
    
    return (
      <AnimatePresence>
        {open && (
          <Dialog
            as={motion.div}
            static
            open={open}
            onClose={handleClose}
            className="relative z-50"
          >
            {/* Overlay */}
            <motion.div
              className={cn(
                'fixed inset-0 bg-black/50 backdrop-blur-sm',
                overlayClassName
              )}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeOnOverlayClick ? handleClose : undefined}
              aria-hidden="true"
            />
            
            {/* Drawer */}
            <div className="fixed inset-0 z-10 overflow-hidden">
              <DialogPanel
                as={motion.div}
                ref={ref}
                className={cn(
                  'fixed bg-white shadow-xl dark:bg-gray-900',
                  positionClasses[position],
                  contentClassName
                )}
                style={drawerSize}
                {...({
                  variants: drawerVariants[position],
                  initial: "hidden",
                  animate: "visible",
                  exit: "exit",
                  transition: { type: 'spring' as const, damping: 25, stiffness: 300 }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    {title && (
                      <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {title}
                      </DialogTitle>
                    )}
                    
                    {showCloseButton && !persistent && (
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={handleClose}
                        aria-label="Fermer"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {children}
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    )
  }
)

Drawer.displayName = 'Drawer'

// ===========================================
// EXPORTS
// ===========================================

export { Modal, ConfirmationModal, Drawer, modalVariants, useModal }