import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getErrorMessage } from '@/lib/api'
import authService from '@/services/authService'
import { showToast } from '@/store/uiStore'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitializing: boolean
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  getCurrentUser: () => Promise<void>
  changePassword: (request: ChangePasswordRequest) => Promise<void>
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>
  resetPassword: (request: ResetPasswordRequest) => Promise<void>
  clearError: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitializing: true,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.login(credentials)
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          showToast.success(`Bienvenue ${response.user.firstName}!`)
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
          set({ isLoading: false })
          showToast.success('Compte créé ! Vous pouvez vous connecter')
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
          console.warn('Erreur logout:', error)
        } finally {
          set({ ...initialState, isInitializing: false })
          showToast.info('À bientôt !')
        }
      },

      checkAuth: async () => {
        const currentState = get()
        set({ isInitializing: true })
        
        // Si user déjà en mémoire (persist), vérifier validité
        if (currentState.user && currentState.isAuthenticated) {
          try {
            await authService.checkAuth()
            set({ isInitializing: false })
            return
          } catch {
            // Session expirée
            set({ ...initialState, isInitializing: false })
            return
          }
        }

        // Sinon, vérifier si cookie existe
        try {
          const response = await authService.checkAuth()
          
          if (response.authenticated && response.user) {
            const userProfile = await authService.getCurrentUser()
            set({ 
              user: userProfile, 
              isAuthenticated: true,
              isInitializing: false
            })
          } else {
            set({ ...initialState, isInitializing: false })
          }
        } catch {
          set({ ...initialState, isInitializing: false })
        }
      },

      getCurrentUser: async () => {
        try {
          const userProfile = await authService.getCurrentUser()
          set({ 
            user: userProfile, 
            isAuthenticated: true
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            user: null,
            isAuthenticated: false,
            error: errorMessage 
          })
          throw error
        }
      },

      changePassword: async (request: ChangePasswordRequest) => {
        set({ isLoading: true, error: null })
        
        try {
          await authService.changePassword(request)
          set({ isLoading: false })
          showToast.success('Mot de passe modifié')
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
          showToast.success('Email envoyé ! Vérifiez votre boîte')
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
          showToast.success('Mot de passe réinitialisé !')
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      clearError: () => set({ error: null }),
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

// Sélecteurs optimisés
export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useIsAdmin = () => useAuthStore(state => 
  state.user?.roles.includes('ROLE_ADMIN') ?? false
)