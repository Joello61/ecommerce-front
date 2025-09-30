'use client'

import { useRouter } from 'next/navigation'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { useAuthStore } from '@/store/authStore'
import { showToast } from '@/store/uiStore'

interface ConnectedChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ConnectedChangePasswordForm({ 
  onSuccess,
  onCancel,
  className 
}: ConnectedChangePasswordFormProps) {
  const router = useRouter()
  const { changePassword } = useAuthStore()

  const handleSubmit = async (data: {
    currentPassword: string
    newPassword: string
    newPasswordConfirm: string
  }) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      })
      showToast.success('Mot de passe modifié avec succès')
    } catch (error) {
      throw error // L'erreur est gérée par le form
    }
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    } else {
      router.push('/account/profile')
    }
  }

  return (
    <ChangePasswordForm
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onCancel={onCancel}
      className={className}
    />
  )
}