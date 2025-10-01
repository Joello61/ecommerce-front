import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Nouveau mot de passe | Sunset Commerce',
  description: 'Créez un nouveau mot de passe sécurisé'
}

interface ResetPasswordPageProps {
  searchParams: {
    token?: string
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams.token

  if (!token) {
    redirect('/login')
  }

  return <ResetPasswordForm token={token} />
}