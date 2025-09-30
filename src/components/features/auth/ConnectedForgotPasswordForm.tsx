'use client'

import { useRouter } from 'next/navigation'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { useAuthStore } from '@/store/authStore'

interface ConnectedForgotPasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ConnectedForgotPasswordForm({ 
  onSuccess,
  onCancel,
  className 
}: ConnectedForgotPasswordFormProps) {
  const router = useRouter()
  const { forgotPassword } = useAuthStore()

  const handleSubmit = async (email: string) => {
    await forgotPassword({ email })
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      setTimeout(() => {
        router.push('/login')
      }, 5000)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/login')
    }
  }

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
      className={className}
    />
  )
}