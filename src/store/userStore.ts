import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { getErrorMessage } from '@/lib/api'
import type { 
  UserProfile, 
  UpdateProfileRequest,
  UserStats,
  Address,
  AddressRequest
} from '@/types'
import userService from '@/services/userService'

interface NotificationPreferences {
  emailNewsletter: boolean
  emailOrderUpdates: boolean
  emailPromotions: boolean
  smsOrderUpdates: boolean
}

interface PrivacyPreferences {
  allowDataCollection: boolean  
  allowPersonalization: boolean
  allowThirdPartySharing: boolean
}

interface UserState {
  // Données utilisateur
  profile: UserProfile | null
  addresses: Address[]
  stats: UserStats | null
  notificationPreferences: NotificationPreferences | null
  privacyPreferences: PrivacyPreferences | null
  
  // États de chargement
  isLoading: boolean
  isProfileLoading: boolean
  isAddressesLoading: boolean
  isStatsLoading: boolean
  isPreferencesLoading: boolean
  isUpdating: boolean
  
  // Erreurs
  error: string | null
  profileError: string | null
  addressError: string | null
  
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
  
  // Actions préférences
  fetchNotificationPreferences: () => Promise<void>
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>
  updatePrivacyPreferences: (preferences: Partial<PrivacyPreferences>) => Promise<void>
  
  // Utilitaires
  getDefaultAddress: () => Address | null
  getAddressById: (id: number) => Address | null
  hasAddress: () => boolean
  
  // Actions internes
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

const initialState = {
  profile: null,
  addresses: [],
  stats: null,
  notificationPreferences: null,
  privacyPreferences: null,
  isLoading: false,
  isProfileLoading: false,
  isAddressesLoading: false,
  isStatsLoading: false,
  isPreferencesLoading: false,
  isUpdating: false,
  error: null,
  profileError: null,
  addressError: null,
}

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    (set, get) => ({
      ...initialState,

      // Actions profil
      fetchProfile: async () => {
        set({ isProfileLoading: true, profileError: null })
        
        try {
          const profile = await userService.getProfile()
          set({ 
            profile, 
            isProfileLoading: false 
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            profile: null,
            isProfileLoading: false, 
            profileError: errorMessage 
          })
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        set({ isUpdating: true, profileError: null })
        
        try {
          const updatedUser = await userService.updateProfile(data)
          
          // Mettre à jour le profil avec les nouvelles données
          const currentProfile = get().profile
          if (currentProfile) {
            const updatedProfile: UserProfile = {
              ...currentProfile,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              fullName: updatedUser.fullName,
              email: updatedUser.email,
              avatarName: updatedUser.avatarName,
              updatedAt: updatedUser.updatedAt,
            }
            set({ 
              profile: updatedProfile,
              isUpdating: false 
            })
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            profileError: errorMessage 
          })
          throw error
        }
      },

      uploadAvatar: async (file: File) => {
        set({ isUpdating: true, profileError: null })
        
        try {
          const updatedUser = await userService.uploadAvatar(file)
          
          const currentProfile = get().profile
          if (currentProfile) {
            set({
              profile: {
                ...currentProfile,
                avatarName: updatedUser.avatarName,
                updatedAt: updatedUser.updatedAt,
              },
              isUpdating: false
            })
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            profileError: errorMessage 
          })
          throw error
        }
      },

      deleteAvatar: async () => {
        set({ isUpdating: true, profileError: null })
        
        try {
          const updatedUser = await userService.deleteAvatar()
          
          const currentProfile = get().profile
          if (currentProfile) {
            set({
              profile: {
                ...currentProfile,
                avatarName: undefined,
                updatedAt: updatedUser.updatedAt,
              },
              isUpdating: false
            })
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            profileError: errorMessage 
          })
          throw error
        }
      },

      // Actions adresses
      fetchAddresses: async () => {
        set({ isAddressesLoading: true, addressError: null })
        
        try {
          const addresses = await userService.getAddresses()
          set({ 
            addresses, 
            isAddressesLoading: false 
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            addresses: [],
            isAddressesLoading: false, 
            addressError: errorMessage 
          })
        }
      },

      createAddress: async (addressData: AddressRequest) => {
        set({ isUpdating: true, addressError: null })
        
        try {
          const newAddress = await userService.createAddress(addressData)
          set((state) => ({ 
            addresses: [...state.addresses, newAddress],
            isUpdating: false 
          }))
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            addressError: errorMessage 
          })
          throw error
        }
      },

      updateAddress: async (addressId: number, addressData: AddressRequest) => {
        set({ isUpdating: true, addressError: null })
        
        try {
          const updatedAddress = await userService.updateAddress(addressId, addressData)
          set((state) => ({
            addresses: state.addresses.map(addr => 
              addr.id === addressId ? updatedAddress : addr
            ),
            isUpdating: false
          }))
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            addressError: errorMessage 
          })
          throw error
        }
      },

      deleteAddress: async (addressId: number) => {
        set({ isUpdating: true, addressError: null })
        
        try {
          await userService.deleteAddress(addressId)
          set((state) => ({
            addresses: state.addresses.filter(addr => addr.id !== addressId),
            isUpdating: false
          }))
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            addressError: errorMessage 
          })
          throw error
        }
      },

      setDefaultAddress: async (addressId: number) => {
        set({ isUpdating: true, addressError: null })
        
        try {
          await userService.setDefaultAddress(addressId)
          
          // Mettre à jour localement
          set((state) => ({
            addresses: state.addresses.map(addr => ({
              ...addr,
              isDefault: addr.id === addressId
            })),
            isUpdating: false
          }))
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            addressError: errorMessage 
          })
          throw error
        }
      },

      // Actions statistiques
      fetchStats: async () => {
        set({ isStatsLoading: true, error: null })
        
        try {
          const stats = await userService.getUserStats()
          set({ 
            stats, 
            isStatsLoading: false 
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            stats: null,
            isStatsLoading: false, 
            error: errorMessage 
          })
        }
      },

      // Actions préférences
      fetchNotificationPreferences: async () => {
        set({ isPreferencesLoading: true, error: null })
        
        try {
          const preferences = await userService.getNotificationPreferences()
          set({ 
            notificationPreferences: preferences,
            isPreferencesLoading: false 
          })
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            notificationPreferences: null,
            isPreferencesLoading: false, 
            error: errorMessage 
          })
        }
      },

      updateNotificationPreferences: async (preferences: Partial<NotificationPreferences>) => {
        set({ isUpdating: true, error: null })
        
        try {
          await userService.updateNotificationPreferences(preferences)
          
          set((state) => ({
            notificationPreferences: state.notificationPreferences 
              ? { ...state.notificationPreferences, ...preferences }
              : null,
            isUpdating: false
          }))
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            error: errorMessage 
          })
          throw error
        }
      },

      updatePrivacyPreferences: async (preferences: Partial<PrivacyPreferences>) => {
        set({ isUpdating: true, error: null })
        
        try {
          await userService.updatePrivacyPreferences(preferences)
          
          set((state) => ({
            privacyPreferences: state.privacyPreferences 
              ? { ...state.privacyPreferences, ...preferences }
              : null,
            isUpdating: false
          }))
        } catch (error) {
          const errorMessage = getErrorMessage(error)
          set({ 
            isUpdating: false, 
            error: errorMessage 
          })
          throw error
        }
      },

      // Utilitaires
      getDefaultAddress: () => {
        const addresses = get().addresses
        return addresses.find(addr => addr.isDefault) || null
      },

      getAddressById: (id: number) => {
        const addresses = get().addresses
        return addresses.find(addr => addr.id === id) || null
      },

      hasAddress: () => {
        return get().addresses.length > 0
      },

      // Actions internes
      setProfile: (profile: UserProfile | null) => {
        set({ profile })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ 
          error: null, 
          profileError: null, 
          addressError: null 
        })
      },

      reset: () => {
        set(initialState)
      },
    })
  )
)

// Sélecteurs pour optimiser les re-renders
export const useUserProfile = () => useUserStore((state) => state.profile)
export const useUserAddresses = () => useUserStore((state) => state.addresses)
export const useUserStats = () => useUserStore((state) => state.stats)
export const useUserNotificationPreferences = () => useUserStore((state) => state.notificationPreferences)
export const useUserLoading = () => useUserStore((state) => state.isLoading)
export const useUserError = () => useUserStore((state) => state.error)
export const useIsUserUpdating = () => useUserStore((state) => state.isUpdating)

// Sélecteurs pour les adresses
export const useDefaultAddress = () => useUserStore((state) => state.getDefaultAddress())
export const useHasAddresses = () => useUserStore((state) => state.hasAddress())

// Hook pour récupérer une adresse par ID
export const useAddressById = (id: number) => {
  return useUserStore((state) => state.getAddressById(id))
}

// Actions pour usage direct
export const userActions = {
  fetchProfile: () => useUserStore.getState().fetchProfile,
  updateProfile: () => useUserStore.getState().updateProfile,
  fetchAddresses: () => useUserStore.getState().fetchAddresses,
  createAddress: () => useUserStore.getState().createAddress,
  updateAddress: () => useUserStore.getState().updateAddress,
  deleteAddress: () => useUserStore.getState().deleteAddress,
  setDefaultAddress: () => useUserStore.getState().setDefaultAddress,
  fetchStats: () => useUserStore.getState().fetchStats,
  clearError: () => useUserStore.getState().clearError,
}