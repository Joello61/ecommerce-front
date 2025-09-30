'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResetPasswordRequest } from '@/types'

interface ResetPasswordFormProps {
  token: string
  onSubmit: (data: ResetPasswordRequest) => Promise<void>
  onSuccess?: () => void
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function ResetPasswordForm({ 
  token, 
  onSubmit, 
  onSuccess,
  isLoading = false,
  error: externalError,
  className 
}: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')

  const error = externalError || submitError

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (submitError) setSubmitError(null)
    if (validationError) setValidationError('')
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

  const validate = () => {
    if (!formData.password) {
      setValidationError('Le mot de passe est requis')
      return false
    }
    if (formData.password.length < 6) {
      setValidationError('Le mot de passe doit contenir au moins 6 caractères')
      return false
    }
    if (formData.password !== formData.passwordConfirm) {
      setValidationError('Les mots de passe ne correspondent pas')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      await onSubmit({
        token,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      })
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation')
    }
  }

  if (success) {
    return (
      <div className={cn('card p-8 text-center', className)}>
        <div className="inline-flex p-4 rounded-full bg-green-50 mb-4">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Mot de passe réinitialisé !</h3>
        <p className="text-gray-600 mb-6">
          Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="btn-primary w-full"
        >
          Se connecter
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-8', className)}>
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h2>
        <p className="text-gray-600">
          Choisissez un mot de passe sécurisé pour votre compte
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Nouveau mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationError && 'border-danger')}
              placeholder="••••••••"
              disabled={isLoading}
              autoFocus
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
              className={cn('input pl-10 pr-10', validationError && 'border-danger')}
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
          {validationError && (
            <p className="mt-1.5 text-sm text-danger">{validationError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </button>
      </div>
    </form>
  )
}