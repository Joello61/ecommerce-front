'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ChangePasswordForm({ onSuccess, onCancel, className }: ChangePasswordFormProps) {
  const router = useRouter()
  const changePassword = useAuthStore(state => state.changePassword)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  const clearError = useAuthStore(state => state.clearError)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const togglePassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordStrength = () => {
    const pwd = formData.newPassword
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
    const errors: Record<string, string> = {}

    if (!formData.currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis'
    }

    if (!formData.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis'
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères'
    } else if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien'
    }

    if (!formData.newPasswordConfirm) {
      errors.newPasswordConfirm = 'La confirmation est requise'
    } else if (formData.newPassword !== formData.newPasswordConfirm) {
      errors.newPasswordConfirm = 'Les mots de passe ne correspondent pas'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      await changePassword(formData)
      setSuccess(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/profile')
        }
      }, 2000)
    } catch {
      // L'erreur est déjà dans le store
    }
  }

  if (success) {
    return (
      <div className={cn('card p-8 text-center', className)}>
        <div className="inline-flex p-4 rounded-full bg-green-50 mb-4">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Mot de passe modifié !</h3>
        <p className="text-gray-600">
          Votre mot de passe a été changé avec succès.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-6', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Changer le mot de passe</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Mot de passe actuel */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Mot de passe actuel *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationErrors.currentPassword && 'border-danger')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.currentPassword && (
            <p className="mt-1.5 text-sm text-danger">{validationErrors.currentPassword}</p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nouveau mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationErrors.newPassword && 'border-danger')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {formData.newPassword && (
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

          {validationErrors.newPassword && (
            <p className="mt-1.5 text-sm text-danger">{validationErrors.newPassword}</p>
          )}
        </div>

        {/* Confirmation */}
        <div>
          <label htmlFor="newPasswordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirmer le nouveau mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              value={formData.newPasswordConfirm}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationErrors.newPasswordConfirm && 'border-danger')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.newPasswordConfirm && (
            <p className="mt-1.5 text-sm text-danger">{validationErrors.newPasswordConfirm}</p>
          )}
        </div>
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
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? 'Modification...' : 'Changer le mot de passe'}
        </button>
      </div>
    </form>
  )
}