'use client'

import * as React from 'react'
import { User, AuthTokens } from '@/lib/types'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/utils'

// ===========================================
// AUTH CONTEXT & TYPES
// ===========================================

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshToken: () => Promise<void>
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirmation: string
  acceptTerms: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// ===========================================
// AUTH PROVIDER COMPONENT
// ===========================================

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // ===========================================
  // INITIALIZATION - Récupérer les données du localStorage
  // ===========================================

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = getLocalStorage<AuthTokens | null>('auth_tokens', null)
        const storedUser = getLocalStorage<User | null>('auth_user', null)

        if (storedTokens && storedUser) {
          // Vérifier si le token n'est pas expiré
          const tokenExpiry = storedTokens.expiresIn * 1000 // Convertir en ms
          const isTokenValid = Date.now() < tokenExpiry

          if (isTokenValid) {
            setState({
              user: storedUser,
              tokens: storedTokens,
              isLoading: false,
              isAuthenticated: true,
            })
          } else {
            // Token expiré, essayer de le rafraîchir
            await refreshToken()
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()
  }, [])

  // ===========================================
  // LOGIN FUNCTION
  // ===========================================

  const login = React.useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/symfony/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur de connexion')
      }

      const data = await response.json()
      const { user, tokens } = data.data

      // Stocker les données
      setLocalStorage('auth_tokens', tokens)
      setLocalStorage('auth_user', user)

      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  // ===========================================
  // REGISTER FUNCTION
  // ===========================================

  const register = React.useCallback(async (userData: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/symfony/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de l\'inscription')
      }

      const data = await response.json()
      const { user, tokens } = data.data

      // Stocker les données
      setLocalStorage('auth_tokens', tokens)
      setLocalStorage('auth_user', user)

      setState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  // ===========================================
  // LOGOUT FUNCTION
  // ===========================================

  const logout = React.useCallback(() => {
    // Supprimer du localStorage
    removeLocalStorage('auth_tokens')
    removeLocalStorage('auth_user')

    // Réinitialiser l'état
    setState({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
    })

    // Optionnel : Appeler l'API pour invalider le token côté serveur
    fetch('/api/symfony/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.tokens?.accessToken}`,
      },
    }).catch(console.error)
  }, [state.tokens?.accessToken])

  // ===========================================
  // UPDATE USER FUNCTION
  // ===========================================

  const updateUser = React.useCallback((userData: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev

      const updatedUser = { ...prev.user, ...userData }
      setLocalStorage('auth_user', updatedUser)

      return {
        ...prev,
        user: updatedUser,
      }
    })
  }, [])

  // ===========================================
  // REFRESH TOKEN FUNCTION
  // ===========================================

  const refreshToken = React.useCallback(async () => {
    const currentTokens = getLocalStorage<AuthTokens | null>('auth_tokens', null)

    if (!currentTokens?.refreshToken) {
      logout()
      return
    }

    try {
      const response = await fetch('/api/symfony/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: currentTokens.refreshToken,
        }),
      })

      if (!response.ok) {
        throw new Error('Impossible de rafraîchir le token')
      }

      const data = await response.json()
      const { tokens } = data.data

      setLocalStorage('auth_tokens', tokens)

      setState(prev => ({
        ...prev,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      }))
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error)
      logout()
    }
  }, [logout])

  // ===========================================
  // AUTO REFRESH TOKEN
  // ===========================================

  React.useEffect(() => {
    if (!state.tokens?.accessToken || !state.isAuthenticated) return

    const tokenExpiry = state.tokens.expiresIn * 1000
    const refreshTime = tokenExpiry - Date.now() - (5 * 60 * 1000) // 5 minutes avant expiration

    if (refreshTime > 0) {
      const timeoutId = setTimeout(() => {
        refreshToken()
      }, refreshTime)

      return () => clearTimeout(timeoutId)
    }
  }, [state.tokens, state.isAuthenticated, refreshToken])

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// ===========================================
// useAuth HOOK
// ===========================================

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ===========================================
// AUTH STATUS HOOK (pour les guards)
// ===========================================

export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth()

  return {
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated && !isLoading,
    user,
  }
}

// ===========================================
// REQUIRE AUTH HOOK (pour les pages protégées)
// ===========================================

export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth()
  const [shouldRedirect, setShouldRedirect] = React.useState(false)

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true)
      
      if (redirectTo) {
        // Rediriger vers la page de connexion
        window.location.href = redirectTo
      }
    }
  }, [isAuthenticated, isLoading, redirectTo])

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect,
  }
}

// ===========================================
// AUTH GUARD COMPONENT
// ===========================================

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ children, fallback, redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo
      return null
    }
    
    return fallback || <div>Accès non autorisé</div>
  }

  return <>{children}</>
}

// ===========================================
// GUEST GUARD COMPONENT (pour login/register)
// ===========================================

interface GuestGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function GuestGuard({ children, redirectTo = '/' }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
  }, [isAuthenticated, isLoading, redirectTo])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}