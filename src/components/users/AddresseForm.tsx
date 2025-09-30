'use client'

import { useState } from 'react'
import { Save, X, AlertCircle } from 'lucide-react'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { Address, AddressRequest } from '@/types'

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

  const handleInputChange = (value: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
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
    if (!formData.street.trim() || formData.street.length < 5) {
      newErrors.street = 'Adresse requise (min 5 caractères)'
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
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {address ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
      </h3>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{submitError}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Nom et Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            disabled={isLoading}
            required
          />
          <Input
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            disabled={isLoading}
            required
          />
        </div>

        {/* Rue */}
        <Input
          label="Adresse"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          placeholder="Numéro et nom de rue"
          error={errors.street}
          disabled={isLoading}
          required
        />

        {/* Code postal et Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Code postal"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder="75001"
            maxLength={5}
            error={errors.zipCode}
            disabled={isLoading}
            required
          />
          <div className="sm:col-span-2">
            <Input
              label="Ville"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Paris"
              error={errors.city}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Pays */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
            Pays *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleSelectChange}
            className={cn('input', errors.country && 'border-danger')}
            disabled={isLoading}
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && (
            <p className="mt-1.5 text-sm text-danger">{errors.country}</p>
          )}
        </div>

        {/* Téléphone */}
        <Input
          label="Téléphone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+33 6 12 34 56 78"
          error={errors.phone}
          disabled={isLoading}
        />

        {/* Par défaut */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleCheckboxChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">Définir comme adresse par défaut</span>
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
          disabled={isLoading}
          className="btn-primary flex-1"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}