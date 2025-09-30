'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RegisterData } from '@/types'

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>
  onSuccess?: () => void
  onError?: (error: string) => void
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function RegisterForm({ 
  onSubmit, 
  onSuccess, 
  onError,
  isLoading = false,
  error: externalError,
  className 
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    acceptTerms: false,
    acceptNewsletter: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const error = externalError || submitError

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    if (submitError) setSubmitError(null)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      errors.firstName = 'Prénom requis (min 2 caractères)'
    }
    
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      errors.lastName = 'Nom requis (min 2 caractères)'
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide'
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Mot de passe requis (min 6 caractères)'
    }
    
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'Les mots de passe ne correspondent pas'
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await onSubmit(formData)
      onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      setSubmitError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const passwordStrength = () => {
    const pwd = formData.password
    if (!pwd) return 0
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 10) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return strength
  }

  const getStrengthLabel = () => {
    const strength = passwordStrength()
    if (strength === 0) return { label: '', color: '' }
    if (strength <= 2) return { label: 'Faible', color: 'bg-danger' }
    if (strength <= 3) return { label: 'Moyen', color: 'bg-warning' }
    return { label: 'Fort', color: 'bg-success' }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Erreur globale */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Nom et Prénom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={cn('input', validationErrors.firstName && 'border-danger')}
            placeholder="Jean"
            disabled={isLoading}
          />
          {validationErrors.firstName && (
            <p className="mt-1.5 text-sm text-danger">{validationErrors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={cn('input', validationErrors.lastName && 'border-danger')}
            placeholder="Dupont"
            disabled={isLoading}
          />
          {validationErrors.lastName && (
            <p className="mt-1.5 text-sm text-danger">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn('input pl-10', validationErrors.email && 'border-danger')}
            placeholder="vous@exemple.com"
            disabled={isLoading}
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1.5 text-sm text-danger">{validationErrors.email}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={cn('input pl-10 pr-10', validationErrors.password && 'border-danger')}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Afficher/masquer le mot de passe"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Force du mot de passe */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    i < passwordStrength() ? getStrengthLabel().color : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">
              Force: {getStrengthLabel().label || 'Entrez un mot de passe'}
            </p>
          </div>
        )}
        
        {validationErrors.password && (
          <p className="mt-1.5 text-sm text-danger">{validationErrors.password}</p>
        )}
      </div>

      {/* Confirmation */}
      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className={cn('input pl-10 pr-10', validationErrors.passwordConfirm && 'border-danger')}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Afficher/masquer le mot de passe"
          >
            {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.passwordConfirm && (
          <p className="mt-1.5 text-sm text-danger">{validationErrors.passwordConfirm}</p>
        )}
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className={cn(
              'w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5',
              validationErrors.acceptTerms && 'border-danger'
            )}
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">
            J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité
          </span>
        </label>
        {validationErrors.acceptTerms && (
          <p className="text-sm text-danger pl-7">{validationErrors.acceptTerms}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptNewsletter"
            checked={formData.acceptNewsletter}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-600">
            Je souhaite recevoir les offres et nouveautés
          </span>
        </label>
      </div>

      {/* Bouton */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Inscription...' : 'Créer mon compte'}
      </button>
    </form>
  )
}