// src/hooks/useUser.ts
import { useCallback } from 'react'
import { 
  useUserStore,
  useUserProfile,
  useUserAddresses,
  useUserStats,
  useUserNotificationPreferences,
  useUserLoading,
  useUserError,
  useIsUserUpdating,
  useDefaultAddress,
  useHasAddresses,
  useAddressById
} from '@/store'
import { showToast } from '@/store'
import type { 
  UpdateProfileRequest, 
  AddressRequest,
  UserProfile,
  Address,
  UserStats 
} from '@/types'
import { useUtil } from '.'

interface UseUserReturn {
  // État
  profile: UserProfile | null
  addresses: Address[]
  stats: UserStats | null
  notificationPreferences: ReturnType<typeof useUserNotificationPreferences>
  isLoading: boolean
  error: string | null
  isUpdating: boolean
  defaultAddress: Address | null
  hasAddresses: boolean
  
  // Actions profil
  fetchProfile: () => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  deleteAvatar: () => Promise<void>
  
  // Actions adresses
  fetchAddresses: () => Promise<void>
  createAddress: (addressData: AddressRequest) => Promise<void>
  updateAddress: (addressId: number, addressData: AddressRequest) => Promise<void>
  deleteAddress: (addressId: number) => Promise<void>
  setDefaultAddress: (addressId: number) => Promise<void>
  
  // Actions statistiques
  fetchStats: () => Promise<void>
  
  // Préférences
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>
  
  // Utilitaires
  getAddressById: (id: number) => Address | null
  getFullName: () => string
  getInitials: () => string
  hasRole: (role: string) => boolean
  isVerified: () => boolean
  
  // Actions utilitaires
  refreshUserData: () => Promise<void>
  clearError: () => void
}

// Interface pour les préférences de notification
interface NotificationPreferences {
  emailNewsletter: boolean
  emailOrderUpdates: boolean
  emailPromotions: boolean
  smsOrderUpdates: boolean
}

export const useUser = (): UseUserReturn => {
  const userStore = useUserStore()
  
  // Sélecteurs optimisés
  const profile = useUserProfile()
  const addresses = useUserAddresses()
  const stats = useUserStats()
  const notificationPreferences = useUserNotificationPreferences()
  const isLoading = useUserLoading()
  const error = useUserError()
  const isUpdating = useIsUserUpdating()
  const defaultAddress = useDefaultAddress()
  const hasAddresses = useHasAddresses()

  // Actions profil avec gestion d'erreurs et notifications
  const fetchProfile = useCallback(async () => {
    try {
      await userStore.fetchProfile()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error('Erreur', 'Impossible de charger le profil')
    }
  }, [userStore])

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      await userStore.updateProfile(data)
      showToast.success('Profil mis à jour avec succès')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de mettre à jour le profil')
      throw error
    }
  }, [userStore])

  const uploadAvatar = useCallback(async (file: File) => {
    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      showToast.error('Erreur', 'Veuillez sélectionner une image')
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      showToast.error('Erreur', 'L\'image ne doit pas dépasser 2MB')
      return
    }

    try {
      await userStore.uploadAvatar(file)
      showToast.success('Avatar mis à jour avec succès')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de télécharger l\'avatar')
      throw error
    }
  }, [userStore])

  const deleteAvatar = useCallback(async () => {
    try {
      await userStore.deleteAvatar()
      showToast.success('Avatar supprimé')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de supprimer l\'avatar')
      throw error
    }
  }, [userStore])

  // Actions adresses
  const fetchAddresses = useCallback(async () => {
    try {
      await userStore.fetchAddresses()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error('Erreur', 'Impossible de charger les adresses')
    }
  }, [userStore])

  const createAddress = useCallback(async (addressData: AddressRequest) => {
    try {
      await userStore.createAddress(addressData)
      showToast.success('Adresse ajoutée avec succès')
    } catch (error) {
      showToast.error('Erreur', 'Impossible d\'ajouter l\'adresse')
      throw error
    }
  }, [userStore])

  const updateAddress = useCallback(async (addressId: number, addressData: AddressRequest) => {
    try {
      await userStore.updateAddress(addressId, addressData)
      showToast.success('Adresse mise à jour')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de mettre à jour l\'adresse')
      throw error
    }
  }, [userStore])

  const deleteAddress = useCallback(async (addressId: number) => {
    try {
      await userStore.deleteAddress(addressId)
      showToast.success('Adresse supprimée')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de supprimer l\'adresse')
      throw error
    }
  }, [userStore])

  const setDefaultAddress = useCallback(async (addressId: number) => {
    try {
      await userStore.setDefaultAddress(addressId)
      showToast.success('Adresse par défaut mise à jour')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de définir l\'adresse par défaut')
      throw error
    }
  }, [userStore])

  // Actions statistiques
  const fetchStats = useCallback(async () => {
    try {
      await userStore.fetchStats()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error('Erreur', 'Impossible de charger les statistiques')
    }
  }, [userStore])

  // Préférences
  const updateNotificationPreferences = useCallback(async (preferences: Partial<NotificationPreferences>) => {
    try {
      await userStore.updateNotificationPreferences(preferences)
      showToast.success('Préférences mises à jour')
    } catch (error) {
      showToast.error('Erreur', 'Impossible de mettre à jour les préférences')
      throw error
    }
  }, [userStore])

  // Utilitaires
  const getAddressById = useCallback((id: number) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAddressById(id)
  }, [])

  const getFullName = useCallback(() => {
    if (!profile) return ''
    return profile.fullName || `${profile.firstName} ${profile.lastName}`
  }, [profile])

  const getInitials = useCallback(() => {
    if (!profile) return ''
    const firstName = profile.firstName.charAt(0).toUpperCase()
    const lastName = profile.lastName.charAt(0).toUpperCase()
    return `${firstName}${lastName}`
  }, [profile])

  const hasRole = useCallback((role: string) => {
    if (!profile) return false
    return profile.roles.includes(role)
  }, [profile])

  const isVerified = useCallback(() => {
    return profile?.isVerified || false
  }, [profile])

  // Actions utilitaires
  const refreshUserData = useCallback(async () => {
    await Promise.all([
      fetchProfile(),
      fetchAddresses(),
      fetchStats()
    ])
  }, [fetchProfile, fetchAddresses, fetchStats])

  const clearError = useCallback(() => {
    userStore.clearError()
  }, [userStore])

  return {
    // État
    profile,
    addresses,
    stats,
    notificationPreferences,
    isLoading,
    error,
    isUpdating,
    defaultAddress,
    hasAddresses,
    
    // Actions profil
    fetchProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    
    // Actions adresses
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Actions statistiques
    fetchStats,
    
    // Préférences
    updateNotificationPreferences,
    
    // Utilitaires
    getAddressById,
    getFullName,
    getInitials,
    hasRole,
    isVerified,
    
    // Actions utilitaires
    refreshUserData,
    clearError,
  }
}

// Hook spécialisé pour la gestion des adresses
export const useAddresses = () => {
  const {
    addresses,
    defaultAddress,
    hasAddresses,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddressById,
    isUpdating,
    error
  } = useUser()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canDeleteAddress = useCallback((addressId: number) => {
    // Ne peut pas supprimer s'il n'y a qu'une seule adresse
    return addresses.length > 1
  }, [addresses])

  const formatAddress = useCallback((address: Address) => {
    return `${address.street}, ${address.city} ${address.zipCode}, ${address.country}`
  }, [])

  const validateAddress = useCallback((addressData: AddressRequest) => {
    const errors: string[] = []
    
    if (!addressData.firstName.trim()) errors.push('Le prénom est requis')
    if (!addressData.lastName.trim()) errors.push('Le nom est requis')
    if (!addressData.street.trim()) errors.push('L\'adresse est requise')
    if (!addressData.city.trim()) errors.push('La ville est requise')
    if (!addressData.zipCode.trim()) errors.push('Le code postal est requis')
    if (!addressData.country.trim()) errors.push('Le pays est requis')
    
    // Validation du code postal français
    if (addressData.zipCode && !/^[0-9]{5}$/.test(addressData.zipCode)) {
      errors.push('Le code postal doit contenir 5 chiffres')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [])

  return {
    addresses,
    defaultAddress,
    hasAddresses,
    isUpdating,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddressById,
    canDeleteAddress,
    formatAddress,
    validateAddress,
  }
}

// Hook pour la gestion de l'avatar
export const useAvatar = () => {
  const { profile, uploadAvatar, deleteAvatar, isUpdating } = useUser()
  const { getImageUrl, getInitials } = useUtil()

  const avatarUrl = profile?.avatarName ? getImageUrl(profile.avatarName) : null
  const initials = getInitials()
  const hasAvatar = !!profile?.avatarName

  const handleAvatarUpload = useCallback(async (file: File) => {
    await uploadAvatar(file)
  }, [uploadAvatar])

  const handleAvatarDelete = useCallback(async () => {
    await deleteAvatar()
  }, [deleteAvatar])

  return {
    avatarUrl,
    initials,
    hasAvatar,
    isUploading: isUpdating,
    uploadAvatar: handleAvatarUpload,
    deleteAvatar: handleAvatarDelete,
  }
}

export default useUser