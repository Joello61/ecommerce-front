'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'
import type { ToastProps } from '@/types'

interface ThemeContextValue {
  // État du thème
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  language: 'fr' | 'en'

  // Actions de thème
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
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
  defaultTheme?: 'light' | 'dark' | 'system'
  defaultLanguage?: 'fr' | 'en'
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  defaultLanguage = 'fr'
}: ThemeProviderProps) {
  const {
    // État du store
    theme,
    language,
    toasts,
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    isPageLoading,

    // Actions du store
    setTheme: setThemeAction,
    toggleTheme: toggleThemeAction,
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

  // Thème résolu (calculé)
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light')

  // Initialisation du thème et de la langue
  useEffect(() => {
    if (theme === 'system') {
      // Si pas encore initialisé, utiliser les valeurs par défaut
      setThemeAction(defaultTheme)
    }
    
    if (!language) {
      setLanguageAction(defaultLanguage)
    }
  }, [theme, language, defaultTheme, defaultLanguage, setThemeAction, setLanguageAction])

  // Gestion du thème système et application au DOM
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement
      let effectiveTheme: 'light' | 'dark'

      if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        effectiveTheme = theme
      }

      setResolvedTheme(effectiveTheme)
      
      // Application des classes CSS
      root.classList.remove('light', 'dark')
      root.classList.add(effectiveTheme)
      
      // Mise à jour de l'attribut data-theme pour compatibilité
      root.setAttribute('data-theme', effectiveTheme)
      
      // Couleur de la barre d'état mobile
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content', 
          effectiveTheme === 'dark' ? '#0f172a' : '#ffffff'
        )
      }
    }

    applyTheme()

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Gestion de la langue
  useEffect(() => {
    if (language) {
      // Mise à jour de l'attribut lang du document
      document.documentElement.lang = language
      
      // Sauvegarde dans localStorage pour persistance
      try {
        localStorage.setItem('preferred-language', language)
      } catch (error) {
        console.warn('Impossible de sauvegarder la langue:', error)
      }
    }
  }, [language])

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K pour ouvrir la recherche
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        toggleSearchModal()
      }
      
      // Ctrl/Cmd + D pour toggle du thème
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault()
        toggleThemeAction()
      }
      
      // Échap pour fermer les modales/drawers
      if (event.key === 'Escape') {
        closeAllDrawers()
        closeAllMenus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleSearchModal, toggleThemeAction, closeAllDrawers, closeAllMenus])

  // Gestion de la visibilité de la page pour optimiser les performances
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause des animations/timers si nécessaire
        console.debug('Page hidden - optimizing performance')
      } else {
        // Reprendre les animations/timers
        console.debug('Page visible - resuming normal operation')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Actions wrapper pour une meilleure API
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeAction(newTheme)
  }

  const toggleTheme = () => {
    toggleThemeAction()
  }

  const setLanguage = (newLanguage: 'fr' | 'en') => {
    setLanguageAction(newLanguage)
  }

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    addToastAction(toast)
  }

  const removeToast = (id: string) => {
    removeToastAction(id)
  }

  const clearToasts = () => {
    clearToastsAction()
  }

  const contextValue: ThemeContextValue = {
    // État
    theme,
    resolvedTheme,
    language,
    toasts,
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    isPageLoading,

    // Actions de thème
    setTheme,
    toggleTheme,
    setLanguage,

    // Notifications
    addToast,
    removeToast,
    clearToasts,

    // Actions d'interface
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

    // Modales
    openModal,
    closeModal,
    isModalOpen,

    // Chargement
    setPageLoading,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook pour utiliser le contexte de thème
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// Hook pour les notifications uniquement
export function useToast() {
  const { toasts, addToast, removeToast, clearToasts } = useTheme()
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    // Helpers pour des notifications typées
    success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
  }
}

// Hook pour les actions d'interface
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
    // États
    isSidebarOpen,
    isCartDrawerOpen,
    isMobileMenuOpen,
    isSearchModalOpen,
    
    // Actions
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

// Hook pour la gestion du thème uniquement
export function useThemeMode() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  }
}

// Hook pour la gestion de la langue
export function useLanguage() {
  const { language, setLanguage } = useTheme()
  
  return {
    language,
    setLanguage,
    isFrench: language === 'fr',
    isEnglish: language === 'en',
  }
}

// Hook pour le chargement global
export function useGlobalLoading() {
  const { isPageLoading, setPageLoading } = useTheme()
  
  return {
    isLoading: isPageLoading,
    setLoading: setPageLoading,
    startLoading: () => setPageLoading(true),
    stopLoading: () => setPageLoading(false),
  }
}

// Hook pour détecter les changements de thème système
export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return systemTheme
}