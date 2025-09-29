'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, AlertCircle } from 'lucide-react'
import type { Address, AddressRequest } from '@/types'
import { cn } from '@/lib/utils'

interface AddressFormProps {
  address?: Address
  onSubmit: (data: AddressRequest) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function AddressForm({ address, onSubmit, onCancel, isLoading, className }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressRequest>({
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    street: address?.street || '',
    city: address?.city || '',
    zipCode: address?.zipCode || '',
    country: address?.country || 'France',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
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
      newErrors.firstName = 'Prénom requis'
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = 'Nom requis'
    }

    if (!formData.street.trim() || formData.street.length < 5) {
      newErrors.street = 'Adresse requise'
    }

    if (!formData.city.trim() || formData.city.length < 2) {
      newErrors.city = 'Ville requise'
    }

    if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Code postal invalide (5 chiffres)'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Pays requis'
    }

    if (formData.phone && !/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Téléphone invalide'
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
      setSubmitError(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-6', className)}>
      <h3 className="text-lg font-semibold mb-6">
        {address ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
      </h3>

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
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
              Prénom *
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

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Nom *
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
        </div>

        {/* Rue */}
        <div>
          <label htmlFor="street" className="block text-sm font-medium mb-2">
            Adresse *
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Numéro et nom de rue"
            className={cn('input', errors.street && 'input-error')}
            disabled={isLoading}
          />
          {errors.street && (
            <p className="mt-1 text-sm text-danger">{errors.street}</p>
          )}
        </div>

        {/* Code postal et Ville */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
              Code postal *
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="75001"
              maxLength={5}
              className={cn('input', errors.zipCode && 'input-error')}
              disabled={isLoading}
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-danger">{errors.zipCode}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Paris"
              className={cn('input', errors.city && 'input-error')}
              disabled={isLoading}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-danger">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Pays */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            Pays *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={cn('input', errors.country && 'input-error')}
            disabled={isLoading}
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-danger">{errors.country}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+33 6 12 34 56 78"
            className={cn('input', errors.phone && 'input-error')}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-danger">{errors.phone}</p>
          )}
        </div>

        {/* Par défaut */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="rounded border-border text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <span className="text-sm">Définir comme adresse par défaut</span>
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
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </motion.button>
      </div>
    </form>
  )
}