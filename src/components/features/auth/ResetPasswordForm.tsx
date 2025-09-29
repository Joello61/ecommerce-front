'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { cn } from '@/lib/utils'
import authService from '@/services/authService'

interface ResetPasswordFormProps {
  token: string
  onSuccess?: () => void
  className?: string
}

export function ResetPasswordForm({ token, onSuccess, className }: ResetPasswordFormProps) {
  const { clearError } = useAuth()
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
    if (validationError) setValidationError('')
    clearError()
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

    setIsLoading(true)
    setError(null)

    try {
      await authService.resetPassword({
        token,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      })
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation')
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
        <h3 className="text-xl font-bold mb-2">Mot de passe réinitialisé !</h3>
        <p className="text-muted-foreground mb-6">
          Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/login'}
          className="btn-primary w-full"
        >
          Se connecter
        </motion.button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-8', className)}>
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Nouveau mot de passe</h2>
        <p className="text-muted-foreground">
          Choisissez un mot de passe sécurisé pour votre compte
        </p>
      </div>

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

      <div className="space-y-6">
        {/* Nouveau mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationError && 'input-error')}
              placeholder="••••••••"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
        </div>

        {/* Confirmation */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={cn('input pl-10 pr-10', validationError && 'input-error')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {validationError && (
            <p className="mt-1 text-sm text-danger">{validationError}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="btn-primary w-full"
        >
          {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
        </motion.button>
      </div>
    </form>
  )
}