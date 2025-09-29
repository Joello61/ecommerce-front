'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { cn } from '@/lib/utils'
import authService from '@/services/authService'

interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ChangePasswordForm({ onSuccess, onCancel, className }: ChangePasswordFormProps) {
  const { clearError } = useAuth()
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    clearError()
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

    setIsLoading(true)
    setError(null)

    try {
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        newPasswordConfirm: formData.newPasswordConfirm,
      })
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('card p-8 text-center', className)}
      >
        <div className="inline-flex p-4 rounded-full bg-success/10 mb-4">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
        <h3 className="text-xl font-bold mb-2">Mot de passe modifié !</h3>
        <p className="text-muted-foreground">
          Votre mot de passe a été changé avec succès.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-6', className)}>
      <h3 className="text-lg font-semibold mb-6">Changer le mot de passe</h3>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex gap-3"
        >
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Mot de passe actuel */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationErrors.currentPassword && 'input-error')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {validationErrors.currentPassword && (
            <p className="mt-1 text-sm text-danger">{validationErrors.currentPassword}</p>
          )}
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationErrors.newPassword && 'input-error')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Force du mot de passe */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      i < passwordStrength() ? getStrengthLabel().color : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Force: {getStrengthLabel().label || 'Entrez un mot de passe'}
              </p>
            </div>
          )}

          {validationErrors.newPassword && (
            <p className="mt-1 text-sm text-danger">{validationErrors.newPassword}</p>
          )}
        </div>

        {/* Confirmation */}
        <div>
          <label htmlFor="newPasswordConfirm" className="block text-sm font-medium mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="newPasswordConfirm"
              name="newPasswordConfirm"
              value={formData.newPasswordConfirm}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationErrors.newPasswordConfirm && 'input-error')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {validationErrors.newPasswordConfirm && (
            <p className="mt-1 text-sm text-danger">{validationErrors.newPasswordConfirm}</p>
          )}
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
            className="btn-outline flex-1"
          >
            Annuler
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="btn-primary flex-1"
        >
          {isLoading ? 'Modification...' : 'Changer le mot de passe'}
        </motion.button>
      </div>
    </form>
  )
}