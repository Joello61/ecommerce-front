'use client'

import { useState } from 'react'
import { Mail, Calendar, Shield, Camera, Loader2 } from 'lucide-react'
import type { UserProfile } from '@/types'
import { formatDate, getImageUrl, cn } from '@/lib/utils'
import Image from 'next/image'

interface ProfileCardProps {
  profile: UserProfile
  onUpdateAvatar?: (file: File) => Promise<void>
  editable?: boolean
  className?: string
}

export function ProfileCard({ profile, onUpdateAvatar, editable = false, className }: ProfileCardProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUpdateAvatar) return

    // Validation
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Le fichier est trop volumineux (max 5MB)')
      return
    }

    if (!file.type.startsWith('image/')) {
      setAvatarError('Le fichier doit être une image')
      return
    }

    setAvatarError(null)
    setIsUploading(true)

    try {
      await onUpdateAvatar(file)
    } catch (error) {
      setAvatarError('Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn('card p-6', className)}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            {profile.avatarName ? (
              <Image
                src={getImageUrl(profile.avatarName)}
                alt={profile.fullName}
                fill
                className="rounded-full object-cover border-4 border-muted"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-4 border-muted">
                <span className="text-4xl font-bold text-white">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </span>
              </div>
            )}

            {/* Bouton upload avatar */}
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
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-white" />
                )}
              </label>
            )}

            {/* Badge vérifié */}
            {profile.isVerified && (
              <div className="absolute -top-1 -right-1 p-1 bg-success rounded-full">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          {avatarError && (
            <p className="text-xs text-danger mt-2">{avatarError}</p>
          )}
        </div>

        {/* Informations */}
        <div className="flex-1 space-y-4">
          {/* Nom complet */}
          <div>
            <h2 className="text-2xl font-bold mb-1">{profile.fullName}</h2>
            <div className="flex flex-wrap gap-2">
              {profile.roles.map((role) => (
                <span key={role} className="badge-primary text-xs">
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Membre depuis {formatDate(profile.createdAt, { month: 'long', year: 'numeric' })}
              </span>
            </div>
            {profile.isVerified ? (
              <div className="flex items-center gap-2 text-success">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Compte vérifié</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-warning">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Compte non vérifié</span>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-primary">{profile.orders}</p>
              <p className="text-sm text-muted-foreground">Commandes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{profile.addresses}</p>
              <p className="text-sm text-muted-foreground">Adresses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}