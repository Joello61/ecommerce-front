'use client'

import { useState } from 'react'
import { Mail, Save, X, AlertCircle } from 'lucide-react'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { UserProfile, UpdateProfileRequest } from '@/types'

interface ProfileFormProps {
  profile: UserProfile
  onSubmit: (data: UpdateProfileRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function ProfileForm({ profile, onSubmit, onCancel, isLoading, className }: ProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    acceptNewsletter: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      await onSubmit(formData)
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
        {/* Prénom */}
        <Input
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          disabled={isLoading}
          required
        />

        {/* Nom */}
        <Input
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          disabled={isLoading}
          required
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          leftIcon={<Mail className="w-5 h-5" />}
          helperText="La modification de l'email nécessitera une vérification"
          error={errors.email}
          disabled={isLoading}
        />

        {/* Newsletter */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="acceptNewsletter"
            checked={formData.acceptNewsletter}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">Recevoir les offres et nouveautés</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-outline flex-1"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !hasChanges()}
          className="btn-primary flex-1"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}