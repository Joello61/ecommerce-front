import { apiClient } from '@/lib/api'
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
  AuthCheckResponse,
  TokenVerificationResponse
} from '@/types'

class AuthService {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return response.data
  }

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    const registerPayload = {
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      firstName: data.firstName,
      lastName: data.lastName,
      acceptTerms: data.acceptTerms,
      acceptNewsletter: data.acceptNewsletter || false,
    }

    const response = await apiClient.post<RegisterResponse>('/auth/register', registerPayload)
    return response.data
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  }

  /**
   * Récupération du profil utilisateur actuel
   */
  async getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/me')
    return response.data
  }

  /**
   * Vérification de l'état d'authentification
   */
  async checkAuth(): Promise<AuthCheckResponse> {
    const response = await apiClient.get<AuthCheckResponse>('/auth/check')
    return response.data
  }

  /**
   * Rafraîchissement du token JWT
   */
  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh')
    return response.data
  }

  /**
   * Changement de mot de passe
   */
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword: request.currentPassword,
      newPassword: request.newPassword,
      newPasswordConfirm: request.newPasswordConfirm,
    })
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/auth/forgot-password', {
      email: request.email,
    })
  }

  /**
   * Réinitialisation du mot de passe avec token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token: request.token,
      password: request.password,
      passwordConfirm: request.passwordConfirm,
    })
  }

  /**
   * Vérification de la validité d'un token de réinitialisation
   */
  async verifyResetToken(token: string): Promise<TokenVerificationResponse> {
    const response = await apiClient.get<TokenVerificationResponse>(`/auth/verify-reset-token/${token}`)
    return response.data
  }

  /**
   * Validation de l'email (si système de vérification activé)
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token })
  }

  /**
   * Renvoi d'email de vérification
   */
  async resendVerificationEmail(): Promise<void> {
    await apiClient.post('/auth/resend-verification')
  }
}

// Instance singleton
export const authService = new AuthService()
export default authService