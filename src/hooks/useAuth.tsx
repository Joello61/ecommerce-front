import { useRouter } from 'next/navigation'
import { useAuthStore, useUser, useIsAuthenticated, useIsAdmin } from '@/store/authStore'

/**
 * Hook utilitaire pour l'auth avec navigation
 */
export function useAuth() {
  const router = useRouter()
  
  // Sélecteurs
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const isAdmin = useIsAdmin()
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  
  // Actions
  const login = useAuthStore(state => state.login)
  const register = useAuthStore(state => state.register)
  const logout = useAuthStore(state => state.logout)
  const clearError = useAuthStore(state => state.clearError)
  
  // Utilitaires de navigation
  const redirectToLogin = (returnUrl?: string) => {
    const url = returnUrl ? `/login?redirect=${returnUrl}` : '/login'
    router.push(url)
  }
  
  const hasRole = (role: string) => user?.roles.includes(role) ?? false

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    
    // Actions
    login,
    register,
    logout,
    clearError,
    
    // Utilitaires
    hasRole,
    redirectToLogin,
  }
}

export default useAuth