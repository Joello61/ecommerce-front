'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { showToast } from '@/store/uiStore'
import { ProfileCard } from '@/components/users/ProfileCard'

interface ConnectedProfileCardProps {
  editable?: boolean
  className?: string
}

export function ConnectedProfileCard({ 
  editable = true,
  className 
}: ConnectedProfileCardProps) {
  const { profile, fetchProfile, uploadAvatar, isProfileLoading } = useUserStore()

  // Charger le profil au montage
  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  const handleUpdateAvatar = async (file: File) => {
    try {
      await uploadAvatar(file)
      showToast.success('Photo de profil mise à jour')
    } catch (error) {
      showToast.error('Erreur lors de la mise à jour')
      throw error
    }
  }

  if (isProfileLoading || !profile) {
    return (
      <div className="card p-6">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    )
  }

  return (
    <ProfileCard
      profile={profile}
      onUpdateAvatar={editable ? handleUpdateAvatar : undefined}
      editable={editable}
      className={className}
    />
  )
}