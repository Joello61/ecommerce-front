import { Metadata } from 'next'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Inscription | Sunset Commerce',
  description: 'Créez votre compte gratuitement'
}

export default function RegisterPage() {
  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-primary"/>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-600">
          Rejoignez-nous en quelques clics
        </p>
      </div>

      <RegisterForm />

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link 
            href="/login" 
            className="font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}