import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ConnectedResetPasswordForm } from '@/components/features/auth/ConnectedResetPasswordForm'

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

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-gray-600">
          Choisissez un mot de passe fort et sécurisé
        </p>
      </div>

      <ConnectedResetPasswordForm token={token} />
    </div>
  )
}