'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { LoginForm } from '@/components/auth/LoginForm'

interface ConnectedLoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
  className?: string
}

export function ConnectedLoginForm({ 
  redirectTo = '/',
  onSuccess,
  className 
}: ConnectedLoginFormProps) {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    clearError()
    await login(credentials)
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      router.push(redirectTo)
    }
  }

  return (
    <LoginForm
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      isLoading={isLoading}
      error={error}
      className={className}
    />
  )
}