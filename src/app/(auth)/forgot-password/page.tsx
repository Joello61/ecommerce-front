import { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Mot de passe oublié | Sunset Commerce',
  description: 'Réinitialisez votre mot de passe'
}

export default function ForgotPasswordPage() {
  return (
    <div className="card">
      <div className="text-center p-8 pb-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary"/>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Mot de passe oublié ?
        </h1>
        <p className="text-gray-600">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      <ForgotPasswordForm 
        onCancel={() => window.location.href = '/login'}
      />
    </div>
  )
}