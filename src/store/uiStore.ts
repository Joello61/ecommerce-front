import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ToastProps } from '@/types'

interface UIState {
  // États d'interface
  isSidebarOpen: boolean
  isCartDrawerOpen: boolean
  isMobileMenuOpen: boolean
  isSearchModalOpen: boolean
  isProfileMenuOpen: boolean
  
  // Thème et apparence
  theme: 'light' | 'dark' | 'system'
  language: 'fr' | 'en'
  
  // Notifications
  toasts: ToastProps[]
  
  // États de chargement globaux
  isPageLoading: boolean
  showPageLoader: boolean
  
  // Modales
  modals: Record<string, boolean>
  
  // Actions de navigation
  toggleSidebar: () => void
  closeSidebar: () => void
  openSidebar: () => void
  
  toggleCartDrawer: () => void
  closeCartDrawer: () => void
  openCartDrawer: () => void
  
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  openMobileMenu: () => void
  
  toggleSearchModal: () => void
  closeSearchModal: () => void
  openSearchModal: () => void
  
  toggleProfileMenu: () => void
  closeProfileMenu: () => void
  
  // Actions de thème
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  setLanguage: (language: 'fr' | 'en') => void
  
  // Actions de notifications
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Actions de chargement
  setPageLoading: (loading: boolean) => void
  showLoader: (show: boolean) => void
  
  // Actions de modales
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean
  closeAllModals: () => void
  
  // Utilitaires
  closeAllDrawers: () => void
  closeAllMenus: () => void
  reset: () => void
}

let toastCounter = 0

const initialState = {
  isSidebarOpen: false,
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isSearchModalOpen: false,
  isProfileMenuOpen: false,
  theme: 'system' as const,
  language: 'fr' as const,
  toasts: [],
  isPageLoading: false,
  showPageLoader: false,
  modals: {},
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions de navigation
      toggleSidebar: () => {
        set((state) => ({ 
          isSidebarOpen: !state.isSidebarOpen,
          isMobileMenuOpen: false // Fermer le menu mobile si ouvert
        }))
      },

      closeSidebar: () => {
        set({ isSidebarOpen: false })
      },

      openSidebar: () => {
        set({ isSidebarOpen: true })
      },

      toggleCartDrawer: () => {
        set((state) => ({ 
          isCartDrawerOpen: !state.isCartDrawerOpen,
          isMobileMenuOpen: false,
          isSidebarOpen: false
        }))
      },

      closeCartDrawer: () => {
        set({ isCartDrawerOpen: false })
      },

      openCartDrawer: () => {
        set({ 
          isCartDrawerOpen: true,
          isMobileMenuOpen: false,
          isSidebarOpen: false
        })
      },

      toggleMobileMenu: () => {
        set((state) => ({ 
          isMobileMenuOpen: !state.isMobileMenuOpen,
          isCartDrawerOpen: false,
          isSidebarOpen: false,
          isProfileMenuOpen: false
        }))
      },

      closeMobileMenu: () => {
        set({ isMobileMenuOpen: false })
      },

      openMobileMenu: () => {
        set({ 
          isMobileMenuOpen: true,
          isCartDrawerOpen: false,
          isSidebarOpen: false,
          isProfileMenuOpen: false
        })
      },

      toggleSearchModal: () => {
        set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen }))
      },

      closeSearchModal: () => {
        set({ isSearchModalOpen: false })
      },

      openSearchModal: () => {
        set({ isSearchModalOpen: true })
      },

      toggleProfileMenu: () => {
        set((state) => ({ 
          isProfileMenuOpen: !state.isProfileMenuOpen,
          isMobileMenuOpen: false
        }))
      },

      closeProfileMenu: () => {
        set({ isProfileMenuOpen: false })
      },

      // Actions de thème
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme })
        
        // Appliquer le thème au DOM
        const root = document.documentElement
        
        if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          root.classList.toggle('dark', prefersDark)
        } else {
          root.classList.toggle('dark', theme === 'dark')
        }
      },

      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },

      setLanguage: (language: 'fr' | 'en') => {
        set({ language })
        
        // Mettre à jour l'attribut lang du document
        document.documentElement.lang = language
      },

      // Actions de notifications
      addToast: (toast: Omit<ToastProps, 'id'>) => {
        const id = `toast-${++toastCounter}`
        const newToast: ToastProps = {
          ...toast,
          id,
          duration: toast.duration || 5000,
        }
        
        set((state) => ({
          toasts: [...state.toasts, newToast]
        }))
        
        // Auto-suppression après la durée spécifiée
        if (newToast.duration! > 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, newToast.duration)
        }
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter(toast => toast.id !== id)
        }))
      },

      clearToasts: () => {
        set({ toasts: [] })
      },

      // Actions de chargement
      setPageLoading: (loading: boolean) => {
        set({ isPageLoading: loading })
      },

      showLoader: (show: boolean) => {
        set({ showPageLoader: show })
      },

      // Actions de modales
      openModal: (modalId: string) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: true }
        }))
      },

      closeModal: (modalId: string) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: false }
        }))
      },

      toggleModal: (modalId: string) => {
        set((state) => ({
          modals: { 
            ...state.modals, 
            [modalId]: !state.modals[modalId] 
          }
        }))
      },

      isModalOpen: (modalId: string) => {
        return get().modals[modalId] || false
      },

      closeAllModals: () => {
        const currentModals = get().modals
        const closedModals = Object.keys(currentModals).reduce((acc, key) => {
          acc[key] = false
          return acc
        }, {} as Record<string, boolean>)
        
        set({ modals: closedModals })
      },

      // Utilitaires
      closeAllDrawers: () => {
        set({
          isSidebarOpen: false,
          isCartDrawerOpen: false,
          isMobileMenuOpen: false,
          isProfileMenuOpen: false
        })
      },

      closeAllMenus: () => {
        set({
          isMobileMenuOpen: false,
          isProfileMenuOpen: false,
          isSearchModalOpen: false
        })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
)

// Sélecteurs pour optimiser les re-renders
export const useTheme = () => useUIStore((state) => state.theme)
export const useLanguage = () => useUIStore((state) => state.language)
export const useToasts = () => useUIStore((state) => state.toasts)
export const usePageLoading = () => useUIStore((state) => state.isPageLoading)
export const useShowLoader = () => useUIStore((state) => state.showPageLoader)

// Sélecteurs pour les états d'interface
export const useIsSidebarOpen = () => useUIStore((state) => state.isSidebarOpen)
export const useIsCartDrawerOpen = () => useUIStore((state) => state.isCartDrawerOpen)
export const useIsMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen)
export const useIsSearchModalOpen = () => useUIStore((state) => state.isSearchModalOpen)
export const useIsProfileMenuOpen = () => useUIStore((state) => state.isProfileMenuOpen)

// Hook pour vérifier si une modale est ouverte
export const useIsModalOpen = (modalId: string) => {
  return useUIStore((state) => state.isModalOpen(modalId))
}

// Actions pour usage direct
export const uiActions = {
  addToast: () => useUIStore.getState().addToast,
  removeToast: () => useUIStore.getState().removeToast,
  openModal: () => useUIStore.getState().openModal,
  closeModal: () => useUIStore.getState().closeModal,
  setTheme: () => useUIStore.getState().setTheme,
  toggleTheme: () => useUIStore.getState().toggleTheme,
  closeAllDrawers: () => useUIStore.getState().closeAllDrawers,
}

// Utilitaires pour les notifications
export const showToast = {
  success: (message: string, title?: string) => {
    useUIStore.getState().addToast({
      type: 'success',
      message,
      title,
    })
  },
  error: (message: string, title?: string) => {
    useUIStore.getState().addToast({
      type: 'error',
      message,
      title,
    })
  },
  warning: (message: string, title?: string) => {
    useUIStore.getState().addToast({
      type: 'warning',
      message,
      title,
    })
  },
  info: (message: string, title?: string) => {
    useUIStore.getState().addToast({
      type: 'info',
      message,
      title,
    })
  },
}