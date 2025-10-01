'use client'

import { useState } from 'react'
import { Mail, Save, X, AlertCircle } from 'lucide-react'
import { useUserStore, useUserProfile } from '@/store/userStore'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/uiStore'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { UpdateProfileRequest } from '@/types'

interface ProfileFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ProfileForm({ onSuccess, onCancel, className }: ProfileFormProps) {
  const profile = useUserProfile()
  const updateProfile = useUserStore(state => state.updateProfile)
  const getCurrentUser = useAuthStore(state => state.getCurrentUser)
  const isUpdating = useUserStore(state => state.isUpdating)

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    acceptNewsletter: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!profile) {
    return (
      <div className="card p-6 text-center text-gray-600">
        Chargement du profil...
      </div>
    )
  }

  const handleInputChange = (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    setSubmitError(null)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = 'Prénom requis (min 2 caractères)'
    }
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = 'Nom requis (min 2 caractères)'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await updateProfile(formData)
      
      // Rafraîchir l'utilisateur dans le authStore si l'email a changé
      if (formData.email && formData.email !== profile.email) {
        await getCurrentUser()
      }
      
      showToast.success('Profil mis à jour avec succès')
      onSuccess?.()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    }
  }

  const hasChanges = () => {
    return (
      formData.firstName !== profile.firstName ||
      formData.lastName !== profile.lastName ||
      (formData.email && formData.email !== profile.email)
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Modifier mon profil</h3>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          disabled={isUpdating}
          required
        />

        <Input
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          disabled={isUpdating}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          leftIcon={<Mail className="w-5 h-5" />}
          helperText="La modification de l'email nécessitera une vérification"
          error={errors.email}
          disabled={isUpdating}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="acceptNewsletter"
            checked={formData.acceptNewsletter}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isUpdating}
          />
          <span className="text-sm text-gray-700">Recevoir les offres et nouveautés</span>
        </label>
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isUpdating}
            className="btn-outline flex-1"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isUpdating || !hasChanges()}
          className="btn-primary flex-1"
        >
          <Save className="w-4 h-4" />
          {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}