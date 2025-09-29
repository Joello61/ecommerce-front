// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  useAuthStore, 
  useUser, 
  useIsAuthenticated, 
  useAuthLoading, 
  useAuthError,
  useIsAdmin,
} from '@/store'
import { showToast } from '@/store'
import type { LoginCredentials, RegisterData, ChangePasswordRequest } from '@/types'

interface UseAuthReturn {
  user: ReturnType<typeof useUser>
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isAdmin: boolean
  
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  
  hasRole: (role: string) => boolean
  requireAuth: () => boolean
  redirectIfNotAuth: (redirectTo?: string) => void
  clearError: () => void
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter()
  const authStore = useAuthStore()
  
  // Sélecteurs optimisés
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const error = useAuthError()
  const isAdmin = useIsAdmin()

  // Actions avec gestion d'erreurs
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials)
      showToast.success('Connexion réussie', 'Bienvenue !')
    } catch (error) {
      // ❌ NE PAS relancer l'erreur ici
      console.error('Login error:', error)
    }
  }, [authStore])

  const register = useCallback(async (data: RegisterData) => {
    try {
      await authStore.register(data)
      showToast.success(
        'Inscription réussie', 
        'Vous pouvez maintenant vous connecter'
      )
    } catch (error) {
      console.error('Register error:', error)
    }
  }, [authStore])

  const logout = useCallback(async () => {
    try {
      await authStore.logout()
      showToast.info('Déconnexion réussie', 'À bientôt !')
      router.push('/')
    } catch (error) {
      showToast.info('Déconnexion effectuée')
      console.log('Logout error:', error)
      router.push('/')
    }
  }, [authStore, router])

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      await authStore.changePassword(data)
      showToast.success('Mot de passe modifié avec succès')
    } catch (error) {
      console.error('Change password error:', error)
    }
  }, [authStore])

  // ✅ CORRECTION : hasRole doit utiliser directement user
  const hasRole = useCallback((role: string) => {
    return user?.roles.includes(role) ?? false
  }, [user])

  const requireAuth = useCallback((): boolean => {
    if (!isAuthenticated) {
      showToast.warning('Connexion requise', 'Veuillez vous connecter')
      router.push('/login')
      return false
    }
    return true
  }, [isAuthenticated, router])

  const redirectIfNotAuth = useCallback((redirectTo = '/login') => {
    if (!isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router])

  const clearError = useCallback(() => {
    authStore.clearError()
  }, [authStore])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    login,
    register,
    logout,
    changePassword,
    hasRole,
    requireAuth,
    redirectIfNotAuth,
    clearError,
  }
}

export const useAuthGuard = (options: {
  redirectTo?: string
  requireAdmin?: boolean
  requiredRoles?: string[]
} = {}) => {
  const { 
    isAuthenticated, 
    isAdmin, 
    hasRole, 
    redirectIfNotAuth 
  } = useAuth()
  const router = useRouter()

  const { redirectTo = '/login', requireAdmin = false, requiredRoles = [] } = options

  const checkAccess = useCallback(() => {
    if (!isAuthenticated) {
      redirectIfNotAuth(redirectTo)
      return false
    }

    if (requireAdmin && !isAdmin) {
      showToast.error('Accès refusé', 'Droits administrateur requis')
      router.push('/')
      return false
    }

    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role))
      if (!hasRequiredRole) {
        showToast.error('Accès refusé', 'Permissions insuffisantes')
        router.push('/')
        return false
      }
    }

    return true
  }, [isAuthenticated, isAdmin, hasRole, requireAdmin, requiredRoles, redirectTo, redirectIfNotAuth, router])

  return {
    isAuthenticated,
    isAdmin,
    hasRole,
    checkAccess,
  }
}

export default useAuth