'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/uiStore'
import type { User, LoginCredentials, RegisterData } from '@/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  isAdmin: boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authStore = useAuthStore()
  const hasInitialized = useRef(false)

  // Vérification auth au montage
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initAuth = async () => {
      try {
        await authStore.checkAuth()
      } catch (error) {
        console.debug('Auth check failed')
        console.log(error)
      }
    }

    initAuth()
  }, [authStore])

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)
      showToast.success(`Bienvenue ${authStore.user?.firstName || ''}!`, 'Connexion réussie')
    } catch (error) {
      // Ne pas relancer l'erreur, elle est déjà dans authStore.error
      console.error('Login error:', error)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      await authStore.register(data)
      showToast.success(
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        'Inscription réussie'
      )
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      showToast.info('Vous avez été déconnecté avec succès', 'À bientôt!')
    } catch (error) {
      showToast.info('Vous avez été déconnecté', 'Session terminée')
      console.log('Logout error:', error)
    }
  }

  const refreshUser = async () => {
    try {
      await authStore.getCurrentUser()
    } catch (error) {
      console.warn('Erreur lors du rafraîchissement du profil:', error)
    }
  }

  const checkAuth = async () => {
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.debug('Vérification auth échouée')
      console.log(error)
    }
  }

  const clearError = () => {
    authStore.clearError()
  }

  const isAdmin = authStore.user?.roles.includes('ROLE_ADMIN') ?? false
  const hasRole = (role: string) => authStore.user?.roles.includes(role) ?? false

  const contextValue: AuthContextValue = {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login,
    register,
    logout,
    refreshUser,
    checkAuth,
    clearError,
    isAdmin,
    hasRole,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading && isAuthenticated,
  }
}

export function usePermissions() {
  const { user, isAuthenticated, hasRole, isAdmin } = useAuth()
  
  const canManageProducts = isAdmin || hasRole('ROLE_MANAGER')
  const canManageOrders = isAdmin || hasRole('ROLE_MANAGER') || hasRole('ROLE_SUPPORT')
  const canManageUsers = isAdmin
  const canAccessAdmin = isAdmin || hasRole('ROLE_MANAGER')
  
  return {
    isAuthenticated,
    isAdmin,
    hasRole,
    canManageProducts,
    canManageOrders,
    canManageUsers,
    canAccessAdmin,
    user,
  }
}