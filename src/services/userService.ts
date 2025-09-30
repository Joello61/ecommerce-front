import { apiClient } from '@/lib/api'
import type {
  User,
  UserProfile,
  UpdateProfileRequest,
  UserStats,
  Address,
  AddressRequest,
  AddressListResponse
} from '@/types'

class UserService {
  /**
   * Récupération du profil utilisateur complet
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/profile')
    return response.data
  }

  /**
   * Mise à jour du profil utilisateur
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    // Créer FormData si un fichier avatar est présent
    let requestData: FormData | UpdateProfileRequest = data

    if (data.avatarFile) {
      const formData = new FormData()
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      if (data.email) formData.append('email', data.email)
      if (data.acceptNewsletter !== undefined) {
        formData.append('acceptNewsletter', data.acceptNewsletter.toString())
      }
      formData.append('avatarFile', data.avatarFile)
      requestData = formData
    }

    const response = await apiClient.put<{ user: User }>('/users/profile', requestData, {
      headers: data.avatarFile ? { 'Content-Type': 'multipart/form-data' } : undefined
    })
    return response.data.user
  }

  /**
   * Récupération des statistiques utilisateur
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<{ stats: UserStats }>('/users/stats')
    return response.data.stats
  }

  /**
   * Upload d'un avatar utilisateur
   */
  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append('avatarFile', file)

    const response = await apiClient.put<{ user: User }>('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data.user
  }

  /**
   * Suppression de l'avatar utilisateur
   */
  async deleteAvatar(): Promise<User> {
    const response = await apiClient.delete<{ user: User }>('/users/profile/avatar')
    return response.data.user
  }

  // ==================== GESTION DES ADRESSES ====================

  /**
   * Récupération de toutes les adresses de l'utilisateur
   */
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<AddressListResponse>('/users/addresses')
    return response.data.addresses
  }

  /**
   * Récupération d'une adresse spécifique
   */
  async getAddress(addressId: number): Promise<Address> {
    const response = await apiClient.get<{ address: Address }>(`/users/addresses/${addressId}`)
    return response.data.address
  }

  /**
   * Création d'une nouvelle adresse
   */
  async createAddress(addressData: AddressRequest): Promise<Address> {
    const response = await apiClient.post<{ address: Address }>('/users/addresses', addressData)
    return response.data.address
  }

  /**
   * Mise à jour d'une adresse existante
   */
  async updateAddress(addressId: number, addressData: AddressRequest): Promise<Address> {
    const response = await apiClient.put<{ address: Address }>(`/users/addresses/${addressId}`, addressData)
    return response.data.address
  }

  /**
   * Suppression d'une adresse
   */
  async deleteAddress(addressId: number): Promise<void> {
    await apiClient.delete(`/users/addresses/${addressId}`)
  }

  /**
   * Définir une adresse comme adresse par défaut
   */
  async setDefaultAddress(addressId: number): Promise<void> {
    await apiClient.post(`/users/addresses/${addressId}/set-default`)
  }

  /**
   * Récupération de l'adresse par défaut
   */
  async getDefaultAddress(): Promise<Address | null> {
    try {
      const addresses = await this.getAddresses()
      return addresses.find(addr => addr.isDefault) || null
    } catch {
      return null
    }
  }

  /**
   * Récupération des adresses de livraison
   */
  async getShippingAddresses(): Promise<Address[]> {
    const addresses = await this.getAddresses()
    return addresses.filter(addr => addr.isDefault || !addr.isDefault) // Toutes pour l'instant
  }

  /**
   * Récupération des adresses de facturation
   */
  async getBillingAddresses(): Promise<Address[]> {
    const addresses = await this.getAddresses()
    return addresses.filter(addr => addr.isDefault || !addr.isDefault) // Toutes pour l'instant
  }

  // ==================== PRÉFÉRENCES UTILISATEUR ====================

  /**
   * Mise à jour des préférences de notification
   */
  async updateNotificationPreferences(preferences: {
    emailNewsletter?: boolean
    emailOrderUpdates?: boolean
    emailPromotions?: boolean
    smsOrderUpdates?: boolean
  }): Promise<void> {
    await apiClient.put('/users/preferences/notifications', preferences)
  }

  /**
   * Récupération des préférences de notification
   */
  async getNotificationPreferences(): Promise<{
    emailNewsletter: boolean
    emailOrderUpdates: boolean
    emailPromotions: boolean
    smsOrderUpdates: boolean
  }> {
    const response = await apiClient.get<{
      emailNewsletter: boolean
      emailOrderUpdates: boolean
      emailPromotions: boolean
      smsOrderUpdates: boolean
    }>('/users/preferences/notifications')
    return response.data
  }

  /**
   * Mise à jour des préférences de confidentialité
   */
  async updatePrivacyPreferences(preferences: {
    allowDataCollection?: boolean
    allowPersonalization?: boolean
    allowThirdPartySharing?: boolean
  }): Promise<void> {
    await apiClient.put('/users/preferences/privacy', preferences)
  }

  // ==================== SÉCURITÉ ET SESSIONS ====================

  /**
   * Récupération des sessions actives
   */
  async getActiveSessions(): Promise<Array<{
    id: string
    device: string
    browser: string
    location: string
    lastActivity: string
    isCurrent: boolean
  }>> {
    const response = await apiClient.get<{
      sessions: Array<{
        id: string
        device: string
        browser: string
        location: string
        lastActivity: string
        isCurrent: boolean
      }>
    }>('/users/security/sessions')
    return response.data.sessions
  }

  /**
   * Déconnexion d'une session spécifique
   */
  async terminateSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/users/security/sessions/${sessionId}`)
  }

  /**
   * Déconnexion de toutes les autres sessions
   */
  async terminateAllOtherSessions(): Promise<void> {
    await apiClient.delete('/users/security/sessions/others')
  }

  /**
   * Activation de l'authentification à deux facteurs
   */
  async enable2FA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    const response = await apiClient.post<{ qrCode: string; backupCodes: string[] }>('/users/security/2fa/enable')
    return response.data
  }

  /**
   * Désactivation de l'authentification à deux facteurs
   */
  async disable2FA(password: string): Promise<void> {
    await apiClient.post('/users/security/2fa/disable', { password })
  }

  /**
   * Vérification du statut 2FA
   */
  async get2FAStatus(): Promise<{ enabled: boolean; backupCodesCount: number }> {
    const response = await apiClient.get<{ enabled: boolean; backupCodesCount: number }>('/users/security/2fa/status')
    return response.data
  }

  // ==================== DONNÉES PERSONNELLES ====================

  /**
   * Export des données personnelles (RGPD)
   */
  async exportPersonalData(): Promise<void> {
    await apiClient.post('/users/data/export')
  }

  /**
   * Demande de suppression de compte (RGPD)
   */
  async requestAccountDeletion(reason?: string): Promise<void> {
    await apiClient.post('/users/data/delete-request', { reason })
  }

  /**
   * Annulation de la demande de suppression
   */
  async cancelAccountDeletion(): Promise<void> {
    await apiClient.delete('/users/data/delete-request')
  }

  /**
   * Récupération du statut de suppression
   */
  async getDeletionStatus(): Promise<{
    pendingDeletion: boolean
    deletionDate?: string
    canCancel: boolean
  }> {
    const response = await apiClient.get<{
      pendingDeletion: boolean
      deletionDate?: string
      canCancel: boolean
    }>('/users/data/deletion-status')
    return response.data
  }

  // ==================== UTILITAIRES ====================

  /**
   * Vérification de la validité de l'email
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const response = await apiClient.post<{ available: boolean }>('/users/check-email', { email })
    return response.data
  }

  /**
   * Recherche d'adresses par code postal
   */
  async searchAddressesByPostalCode(postalCode: string): Promise<Array<{
    street: string
    city: string
    postalCode: string
    country: string
  }>> {
    const response = await apiClient.get<{
      addresses: Array<{
        street: string
        city: string
        postalCode: string
        country: string
      }>
    }>(`/users/addresses/search?postalCode=${postalCode}`)
    return response.data.addresses
  }

  /**
   * Validation d'une adresse
   */
  async validateAddress(address: Partial<AddressRequest>): Promise<{
    isValid: boolean
    suggestions?: Partial<AddressRequest>[]
    errors?: string[]
  }> {
    const response = await apiClient.post<{
      isValid: boolean
      suggestions?: Partial<AddressRequest>[]
      errors?: string[]
    }>('/users/addresses/validate', address)
    return response.data
  }
}

// Instance singleton
export const userService = new UserService()
export default userService