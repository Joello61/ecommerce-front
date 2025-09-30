import { Metadata } from 'next'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { ConnectedLoginForm } from '@/components/features/auth/ConnectedLoginForm'

export const metadata: Metadata = {
  title: 'Connexion | Sunset Commerce',
  description: 'Connectez-vous à votre compte'
}

export default function LoginPage() {
  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-primary"/>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Bon retour !
        </h1>
        <p className="text-gray-600">
          Connectez-vous pour accéder à votre compte
        </p>
      </div>

      <ConnectedLoginForm />

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link 
            href="/register" 
            className="font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}