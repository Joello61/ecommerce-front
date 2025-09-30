'use client'

import { useRouter } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { useAuthStore } from '@/store/authStore'

interface ConnectedResetPasswordFormProps {
  token: string
  onSuccess?: () => void
  className?: string
}

export function ConnectedResetPasswordForm({ 
  token,
  onSuccess,
  className 
}: ConnectedResetPasswordFormProps) {
  const router = useRouter()
  const { resetPassword, isLoading, error } = useAuthStore()

  const handleSubmit = async (data: {
    token: string
    password: string
    passwordConfirm: string
  }) => {
    await resetPassword(data)
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  return (
    <ResetPasswordForm
      token={token}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      isLoading={isLoading}
      error={error}
      className={className}
    />
  )
}