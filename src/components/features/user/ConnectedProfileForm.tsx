'use client'

import { useUserStore } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/uiStore'
import type { UpdateProfileRequest } from '@/types'
import { ProfileForm } from '@/components/users/ProfileForm'

interface ConnectedProfileFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ConnectedProfileForm({ 
  onSuccess,
  onCancel,
  className 
}: ConnectedProfileFormProps) {
  const { profile, updateProfile, isUpdating } = useUserStore()
  const { getCurrentUser } = useAuthStore()

  if (!profile) {
    return (
      <div className="card p-6 text-center text-gray-600">
        Chargement du profil...
      </div>
    )
  }

  const handleSubmit = async (data: UpdateProfileRequest) => {
    try {
      await updateProfile(data)
      
      // Rafraîchir l'utilisateur dans le authStore si l'email a changé
      if (data.email && data.email !== profile.email) {
        await getCurrentUser()
      }
      
      showToast.success('Profil mis à jour avec succès')
      onSuccess?.()
    } catch (error) {
      // L'erreur est déjà gérée par le store
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return (
    <ProfileForm
      profile={profile}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isUpdating}
      className={className}
    />
  )
}