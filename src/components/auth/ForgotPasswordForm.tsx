'use client'

import { useState } from 'react'
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ForgotPasswordForm({ onSubmit, onSuccess, onCancel, className }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError(null)
  }

  const validate = () => {
    if (!email) {
      setError('L\'email est requis')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide')
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
      await onSubmit(email)
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi')
    } finally {
      setIsLoading(false)
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
              className={cn('input pl-10', error && 'border-danger')}
              placeholder="vous@exemple.com"
              disabled={isLoading}
              autoFocus
            />
          </div>
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