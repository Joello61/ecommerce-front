'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'
import type { ToastProps } from '@/types'

interface ThemeContextValue {
  // Langue
  language: 'fr' | 'en'
  setLanguage: (language: 'fr' | 'en') => void

  // Notifications
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // États d'interface
  isSidebarOpen: boolean
  isCartDrawerOpen: boolean
  isMobileMenuOpen: boolean
  isSearchModalOpen: boolean

  // Actions d'interface
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
  toggleCartDrawer: () => void
  openCartDrawer: () => void
  closeCartDrawer: () => void
  toggleMobileMenu: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleSearchModal: () => void
  openSearchModal: () => void
  closeSearchModal: () => void
  closeAllDrawers: () => void
  closeAllMenus: () => void

  // Modales
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean

  // Chargement global
  isPageLoading: boolean
  setPageLoading: (loading: boolean) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultLanguage?: 'fr' | 'en'
}

export function ThemeProvider({ 
  children, 
  defaultLanguage = 'fr'
}: ThemeProviderProps) {
  const {
    language,
    toasts,
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    isPageLoading,
    setLanguage: setLanguageAction,
    addToast: addToastAction,
    removeToast: removeToastAction,
    clearToasts: clearToastsAction,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    toggleSearchModal,
    openSearchModal,
    closeSearchModal,
    closeAllDrawers,
    closeAllMenus,
    openModal,
    closeModal,
    isModalOpen,
    setPageLoading,
  } = useUIStore()

  // Initialisation de la langue
  useEffect(() => {
    if (!language) {
      setLanguageAction(defaultLanguage)
    }
  }, [language, defaultLanguage, setLanguageAction])

  // Gestion de la langue
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language
      
      try {
        localStorage.setItem('preferred-language', language)
      } catch (error) {
        console.warn('Impossible de sauvegarder la langue:', error)
      }
    }
  }, [language])

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K pour recherche
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        toggleSearchModal()
      }
      
      // Échap pour fermer
      if (event.key === 'Escape') {
        closeAllDrawers()
        closeAllMenus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSearchModal, closeAllDrawers, closeAllMenus])

  const contextValue: ThemeContextValue = {
    language,
    setLanguage: setLanguageAction,
    toasts,
    addToast: addToastAction,
    removeToast: removeToastAction,
    clearToasts: clearToastsAction,
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    isPageLoading,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    toggleSearchModal,
    openSearchModal,
    closeSearchModal,
    closeAllDrawers,
    closeAllMenus,
    openModal,
    closeModal,
    isModalOpen,
    setPageLoading,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export function useToast() {
  const { toasts, addToast, removeToast, clearToasts } = useTheme()
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
  }
}

export function useUI() {
  const {
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    toggleSearchModal,
    openSearchModal,
    closeSearchModal,
    closeAllDrawers,
    closeAllMenus,
    openModal,
    closeModal,
    isModalOpen,
  } = useTheme()
  
  return {
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleCartDrawer,
    openCartDrawer,
    closeCartDrawer,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    toggleSearchModal,
    openSearchModal,
    closeSearchModal,
    closeAllDrawers,
    closeAllMenus,
    openModal,
    closeModal,
    isModalOpen,
  }
}

export function useLanguage() {
  const { language, setLanguage } = useTheme()
  
  return {
    language,
    setLanguage,
    isFrench: language === 'fr',
    isEnglish: language === 'en',
  }
}

export function useGlobalLoading() {
  const { isPageLoading, setPageLoading } = useTheme()
  
  return {
    isLoading: isPageLoading,
    setLoading: setPageLoading,
    startLoading: () => setPageLoading(true),
    stopLoading: () => setPageLoading(false),
  }
}