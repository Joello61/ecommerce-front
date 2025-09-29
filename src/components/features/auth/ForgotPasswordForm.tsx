'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { cn } from '@/lib/utils'
import authService from '@/services/authService'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ForgotPasswordForm({ onSuccess, onCancel, className }: ForgotPasswordFormProps) {
  const { clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) setError(null)
    clearError()
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
      await authService.forgotPassword({ email })
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('card p-8 text-center', className)}
      >
        <div className="inline-flex p-4 rounded-full bg-success/10 mb-4">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
        <h3 className="text-xl font-bold mb-2">Email envoyé !</h3>
        <p className="text-muted-foreground mb-6">
          Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
          Vérifiez votre boîte de réception et suivez les instructions.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Le lien est valable pendant 1 heure.
        </p>
        {onCancel && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="btn-outline w-full"
          >
            Retour à la connexion
          </motion.button>
        )}
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('card p-8', className)}>
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Mot de passe oublié ?</h2>
        <p className="text-muted-foreground">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
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
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              className={cn('input pl-10', error && 'input-error')}
              placeholder="vous@exemple.com"
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="btn-primary w-full inline-flex items-center justify-center gap-2"
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
          <ArrowRight className="h-5 w-5" />
        </motion.button>

        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-ghost w-full"
          >
            Retour à la connexion
          </motion.button>
        )}
      </div>
    </form>
  )
}