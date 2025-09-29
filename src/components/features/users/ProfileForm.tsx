'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Save, X, AlertCircle } from 'lucide-react'
import type { UserProfile, UpdateProfileRequest } from '@/types'
import { cn } from '@/lib/utils'

interface ProfileFormProps {
  profile: UserProfile
  onSubmit: (data: UpdateProfileRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function ProfileForm({ profile, onSubmit, onCancel, isLoading, className }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    acceptNewsletter: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    setSubmitError(null)
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
      <h3 className="text-lg font-semibold mb-6">Modifier mon profil</h3>

      {submitError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex gap-3"
        >
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{submitError}</p>
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Prénom */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={cn('input', errors.firstName && 'input-error')}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-danger">{errors.firstName}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={cn('input', errors.lastName && 'input-error')}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-danger">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={cn('input pl-10', errors.email && 'input-error')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-danger">{errors.email}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            La modification de l&apos;email nécessitera une vérification
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="acceptNewsletter"
              checked={formData.acceptNewsletter}
              onChange={handleChange}
              className="rounded border-border text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <span className="text-sm">Recevoir les offres et nouveautés</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-border">
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-outline flex-1 inline-flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Annuler
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={isLoading || !hasChanges()}
          whileHover={{ scale: isLoading || !hasChanges() ? 1 : 1.02 }}
          whileTap={{ scale: isLoading || !hasChanges() ? 1 : 0.98 }}
          className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </motion.button>
      </div>
    </form>
  )
}