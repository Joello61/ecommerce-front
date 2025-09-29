// src/components/features/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function LoginForm({ onSuccess, onError, className }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

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
    if (error) clearError()
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
      await login(formData)
      // ✅ Vérifier si la connexion a réussi avant d'appeler onSuccess
      if (!error) {
        onSuccess?.()
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useAuth
      console.log('Login failed:', err)
      onError?.(error || 'Erreur de connexion')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)} noValidate>
      {/* Erreur globale */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-danger/10 border border-danger/20 rounded-lg flex gap-3"
        >
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </motion.div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn('input pl-10', validationErrors.email && 'input-error')}
            placeholder="vous@exemple.com"
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-sm text-danger">{validationErrors.email}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={cn('input pl-10 pr-10', validationErrors.password && 'input-error')}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-sm text-danger">{validationErrors.password}</p>
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
            className="rounded border-border text-primary focus:ring-primary"
            disabled={isLoading}
          />
          <span className="text-sm">Se souvenir de moi</span>
        </label>
      </div>

      {/* Bouton de soumission */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="btn-primary w-full"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </motion.button>
    </form>
  )
}