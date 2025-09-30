'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LoginCredentials } from '@/types'
import Link from 'next/link'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  onSuccess?: () => void
  onError?: (error: string) => void
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function LoginForm({ 
  onSubmit, 
  onSuccess, 
  onError, 
  isLoading = false,
  error: externalError,
  className 
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
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
    
    if (!formData.email) {
      errors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide'
    }
    
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis'
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
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion'
      setSubmitError(errorMessage)
      onError?.(errorMessage)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)} noValidate>
      {/* Erreur globale */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

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
            autoComplete="email"
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
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
            aria-label="Afficher/masquer le mot de passe"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1.5 text-sm text-danger">{validationErrors.password}</p>
        )}
      </div>

      {/* Se souvenir */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">Se souvenir de moi</span>
        </label>
      </div>

      <div className="text-center mt-4">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}