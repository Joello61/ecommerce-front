import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { getErrorMessage } from '@/lib/api'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@/types'
import authService from '@/services/authService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<void>
  changePassword: (request: ChangePasswordRequest) => Promise<void>
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>
  resetPassword: (request: ResetPasswordRequest) => Promise<void>
  verifyResetToken: (token: string) => Promise<boolean>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        ...initialState,

        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null })
          
          try {
            const response = await authService.login(credentials)
            const user = response.user
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false, 
              error: errorMessage 
            })
            throw error
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null })
          
          try {
            await authService.register(data)
            set({ isLoading: false, error: null })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        logout: async () => {
          set({ isLoading: true })
          
          try {
            await authService.logout()
          } catch (error) {
            console.warn('Erreur lors de la déconnexion:', error)
          } finally {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            })
          }
        },

        getCurrentUser: async () => {
          set({ isLoading: true, error: null })
          
          try {
            const userProfile = await authService.getCurrentUser()
            const user: User = {
              id: userProfile.id,
              email: userProfile.email,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              fullName: userProfile.fullName,
              roles: userProfile.roles,
              createdAt: userProfile.createdAt,
              updatedAt: userProfile.updatedAt,
              isVerified: userProfile.isVerified,
              avatarName: userProfile.avatarName,
            }
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            })
          } catch (error) {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false, 
              error: getErrorMessage(error)
            })
          }
        },

        checkAuth: async () => {
          const currentState = useAuthStore.getState()
          
          // Si déjà en train de charger, ne rien faire
          if (currentState.isLoading) {
            return
          }

          try {
            const response = await authService.checkAuth()
            
            if (response.authenticated && response.user) {
              // Si checkAuth retourne un user complet, l'utiliser
              if ('firstName' in response.user && 'lastName' in response.user) {
                const user: User = response.user as User
                set({ 
                  user, 
                  isAuthenticated: true,
                  error: null
                })
              } else {
                // Sinon, récupérer le profil complet (évite la boucle avec un flag)
                set({ isLoading: true })
                try {
                  const userProfile = await authService.getCurrentUser()
                  const user: User = {
                    id: userProfile.id,
                    email: userProfile.email,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    fullName: userProfile.fullName,
                    roles: userProfile.roles,
                    createdAt: userProfile.createdAt,
                    updatedAt: userProfile.updatedAt,
                    isVerified: userProfile.isVerified,
                    avatarName: userProfile.avatarName,
                  }
                  
                  set({ 
                    user, 
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                  })
                } catch (err) {
                  set({ 
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                  })
                }
              }
            } else {
              if (currentState.isAuthenticated || currentState.user) {
                set({ 
                  user: null, 
                  isAuthenticated: false,
                  error: null
                })
              }
            }
          } catch (error) {
            if (currentState.isAuthenticated || currentState.user) {
              set({ 
                user: null, 
                isAuthenticated: false,
                error: null
              })
            }
          }
        },

        refreshToken: async () => {
          try {
            const response = await authService.refreshToken()
            const user = response.user
            
            set({ 
              user, 
              isAuthenticated: true,
              error: null
            })
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              error: null
            })
            throw error
          }
        },

        changePassword: async (request: ChangePasswordRequest) => {
          set({ isLoading: true, error: null })
          
          try {
            await authService.changePassword(request)
            set({ isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        forgotPassword: async (request: ForgotPasswordRequest) => {
          set({ isLoading: true, error: null })
          
          try {
            await authService.forgotPassword(request)
            set({ isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        resetPassword: async (request: ResetPasswordRequest) => {
          set({ isLoading: true, error: null })
          
          try {
            await authService.resetPassword(request)
            set({ isLoading: false })
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            throw error
          }
        },

        verifyResetToken: async (token: string) => {
          set({ isLoading: true, error: null })
          
          try {
            await authService.verifyResetToken(token)
            set({ isLoading: false })
            return true
          } catch (error) {
            const errorMessage = getErrorMessage(error)
            set({ isLoading: false, error: errorMessage })
            return false
          }
        },

        setUser: (user: User | null) => {
          set({ 
            user, 
            isAuthenticated: !!user 
          })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        setError: (error: string | null) => {
          set({ error })
        },

        clearError: () => {
          set({ error: null })
        },

        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)

// Sélecteurs optimisés
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)

export const useIsAdmin = () => {
  return useAuthStore((state) => 
    state.user?.roles.includes('ROLE_ADMIN') ?? false
  )
}

export const useHasRole = (role: string) => {
  return useAuthStore((state) => 
    state.user?.roles.includes(role) ?? false
  )
}

export const authActions = {
  login: () => useAuthStore.getState().login,
  logout: () => useAuthStore.getState().logout,
  checkAuth: () => useAuthStore.getState().checkAuth,
  clearError: () => useAuthStore.getState().clearError,
}