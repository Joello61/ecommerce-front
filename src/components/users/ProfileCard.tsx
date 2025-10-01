'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Mail, Calendar, Shield, Camera, Loader2 } from 'lucide-react'
import { useUserStore, useUserProfile } from '@/store/userStore'
import { showToast } from '@/store/uiStore'
import { cn, formatDate, getImageUrl } from '@/lib/utils'

interface ProfileCardProps {
  editable?: boolean
  className?: string
}

export function ProfileCard({ editable = false, className }: ProfileCardProps) {
  const profile = useUserProfile()
  const fetchProfile = useUserStore(state => state.fetchProfile)
  const uploadAvatar = useUserStore(state => state.uploadAvatar)
  const isProfileLoading = useUserStore(state => state.isProfileLoading)
  
  const [isUploading, setIsUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Fichier trop volumineux (max 5MB)')
      return
    }
    if (!file.type.startsWith('image/')) {
      setAvatarError('Le fichier doit être une image')
      return
    }

    setAvatarError(null)
    setIsUploading(true)

    try {
      await uploadAvatar(file)
      showToast.success('Photo de profil mise à jour')
    } catch (error) {
      setAvatarError('Erreur lors de l\'upload')
      showToast.error('Erreur lors de la mise à jour')
      console.log('Avatar upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (isProfileLoading || !profile) {
    return (
      <div className={cn('card p-6', className)}>
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    )
  }

  return (
    <div className={cn('card p-6', className)}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            {profile.avatarName ? (
              <Image
                src={getImageUrl('avatar',profile.avatarName)}
                alt={profile.fullName}
                fill
                className="rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-gray-100">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {(profile.firstName?.charAt(0) || '?').toUpperCase()}
                  {(profile.lastName?.charAt(0) || '?').toUpperCase()}
                </span>
              </div>
            )}

            {/* Bouton upload */}
            {editable && (
              <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </label>
            )}
          </div>

          {avatarError && (
            <p className="text-xs text-danger mt-2 text-center">{avatarError}</p>
          )}
        </div>

        {/* Informations */}
        <div className="flex-1 space-y-4">
          {/* Nom et rôles */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.fullName}</h2>
            <div className="flex flex-wrap gap-2">
              {profile.roles?.map((role) => (
                <span key={role} className="badge bg-primary/10 text-primary">
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">
                Membre depuis {formatDate(profile.createdAt)}
              </span>
            </div>
            {profile.isVerified ? (
              <div className="flex items-center gap-2 text-success">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">Compte vérifié</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-warning">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Compte non vérifié</span>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-primary">{profile.orders}</p>
              <p className="text-sm text-gray-600">Commandes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{profile.addresses}</p>
              <p className="text-sm text-gray-600">Adresses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}