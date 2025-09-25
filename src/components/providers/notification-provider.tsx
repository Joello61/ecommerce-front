'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'framer-motion'

// ===========================================
// NOTIFICATION TYPES
// ===========================================

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Helpers
  success: (title: string, message?: string, options?: Partial<Notification>) => string
  error: (title: string, message?: string, options?: Partial<Notification>) => string
  warning: (title: string, message?: string, options?: Partial<Notification>) => string
  info: (title: string, message?: string, options?: Partial<Notification>) => string
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

// ===========================================
// NOTIFICATION PROVIDER
// ===========================================

interface NotificationProviderProps {
  children: React.ReactNode
  maxNotifications?: number
}

export function NotificationProvider({ 
  children, 
  maxNotifications = 5 
}: NotificationProviderProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  // Ajouter une notification
  const addNotification = React.useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // 5 secondes par défaut
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      // Limiter le nombre de notifications
      return updated.slice(0, maxNotifications)
    })

    // Auto-remove après la durée spécifiée (sauf si persistent)
    if (!notification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [maxNotifications])

  // Supprimer une notification
  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  // Vider toutes les notifications
  const clearNotifications = React.useCallback(() => {
    setNotifications([])
  }, [])

  // Helpers pour les types de notifications
  const success = React.useCallback((
    title: string, 
    message?: string, 
    options?: Partial<Notification>
  ): string => {
    return addNotification({ ...options, type: 'success', title, message })
  }, [addNotification])

  const error = React.useCallback((
    title: string, 
    message?: string, 
    options?: Partial<Notification>
  ): string => {
    return addNotification({ 
      ...options, 
      type: 'error', 
      title, 
      message,
      duration: options?.duration ?? 8000 // Erreurs plus longues par défaut
    })
  }, [addNotification])

  const warning = React.useCallback((
    title: string, 
    message?: string, 
    options?: Partial<Notification>
  ): string => {
    return addNotification({ ...options, type: 'warning', title, message })
  }, [addNotification])

  const info = React.useCallback((
    title: string, 
    message?: string, 
    options?: Partial<Notification>
  ): string => {
    return addNotification({ ...options, type: 'info', title, message })
  }, [addNotification])

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

// ===========================================
// NOTIFICATION CONTAINER
// ===========================================

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      <AnimatePresence>
        {notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRemove={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ===========================================
// NOTIFICATION CARD
// ===========================================

interface NotificationCardProps {
  notification: Notification
  onRemove: () => void
}

function NotificationCard({ notification, onRemove }: NotificationCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }

  const colors = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-400',
      title: 'text-green-800 dark:text-green-300',
      message: 'text-green-700 dark:text-green-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-400',
      title: 'text-red-800 dark:text-red-300',
      message: 'text-red-700 dark:text-red-400',
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-400',
      title: 'text-orange-800 dark:text-orange-300',
      message: 'text-orange-700 dark:text-orange-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800 dark:text-blue-300',
      message: 'text-blue-700 dark:text-blue-400',
    },
  }

  const Icon = icons[notification.type]
  const colorScheme = colors[notification.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        colorScheme.bg,
        colorScheme.border
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', colorScheme.icon)} />
        </div>
        
        <div className="ml-3 flex-1">
          <p className={cn('text-sm font-medium', colorScheme.title)}>
            {notification.title}
          </p>
          
          {notification.message && (
            <p className={cn('mt-1 text-sm', colorScheme.message)}>
              {notification.message}
            </p>
          )}

          {notification.action && (
            <div className="mt-3">
              <button
                type="button"
                className={cn(
                  'text-sm font-medium underline hover:no-underline',
                  colorScheme.title
                )}
                onClick={() => {
                  notification.action?.onClick()
                  onRemove()
                }}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            className={cn(
              'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              'hover:bg-black/5 dark:hover:bg-white/5',
              colorScheme.message
            )}
            onClick={onRemove}
          >
            <span className="sr-only">Fermer</span>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Barre de progression pour les notifications temporaires */}
      {!notification.persistent && notification.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
          <motion.div
            className={cn('h-full', {
              'bg-green-400': notification.type === 'success',
              'bg-red-400': notification.type === 'error',
              'bg-orange-400': notification.type === 'warning',
              'bg-blue-400': notification.type === 'info',
            })}
            initial={{ width: '100%' }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ 
              duration: notification.duration / 1000, 
              ease: 'linear',
              ...(isHovered && { duration: 0 })
            }}
          />
        </div>
      )}
    </motion.div>
  )
}

// ===========================================
// HOOK
// ===========================================

export function useNotifications(): NotificationContextType {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}