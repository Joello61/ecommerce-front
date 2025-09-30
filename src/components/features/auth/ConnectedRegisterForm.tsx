'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { RegisterForm } from '@/components/auth/RegisterForm'

interface ConnectedRegisterFormProps {
  redirectTo?: string
  onSuccess?: () => void
  className?: string
}

export function ConnectedRegisterForm({ 
  redirectTo = '/login',
  onSuccess,
  className 
}: ConnectedRegisterFormProps) {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuth()

  const handleSubmit = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
    acceptTerms: boolean
    acceptNewsletter?: boolean
  }) => {
    clearError()
    await register(data)
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      router.push(redirectTo)
    }
  }

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      isLoading={isLoading}
      error={error}
      className={className}
    />
  )
}