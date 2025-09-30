import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute'
import { ConnectedChangePasswordForm } from '@/components/features/auth/ConnectedChangePasswordForm'

export const metadata: Metadata = {
  title: 'Changer le mot de passe | Sunset Commerce',
  description: 'Modifiez votre mot de passe actuel'
}

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Changer le mot de passe
          </h1>
          <p className="text-gray-600">
            Mettez à jour votre mot de passe pour plus de sécurité
          </p>
        </div>

        <ConnectedChangePasswordForm />
      </div>
    </ProtectedRoute>
  )
}