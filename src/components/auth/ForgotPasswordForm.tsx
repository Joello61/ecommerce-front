'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ForgotPasswordForm({ onSuccess, onCancel, className }: ForgotPasswordFormProps) {
  const router = useRouter()
  const forgotPassword = useAuthStore(state => state.forgotPassword)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  const clearError = useAuthStore(state => state.clearError)

  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) clearError()
    if (validationError) setValidationError('')
  }

  const validate = () => {
    if (!email) {
      setValidationError('L\'email est requis')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Email invalide')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    try {
      await forgotPassword({ email })
      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => {
          router.push('/login')
        }, 5000)
      }
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h3>
        <p className="text-gray-600 mb-6">
          Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
          Vérifiez votre boîte de réception et suivez les instructions.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Le lien est valable pendant 1 heure.
        </p>
        {onCancel && (
          <button onClick={onCancel} className="btn-outline w-full">
            Retour à la connexion
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('p-8', className)}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              className={cn('input pl-10', (error || validationError) && 'border-danger')}
              placeholder="vous@exemple.com"
              disabled={isLoading}
              autoFocus
            />
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
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
          <ArrowRight className="w-5 h-5" />
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-outline w-full"
          >
            Retour à la connexion
          </button>
        )}
      </div>
    </form>
  )
}