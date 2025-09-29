// src/app/(auth)/login/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { LoginForm } from '@/components/features/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* En-tête */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark mb-4"
        >
          <LogIn className="h-8 w-8 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Bon retour !</h1>
        <p className="text-muted-foreground">
          Connectez-vous pour accéder à votre compte
        </p>
      </div>

      {/* Formulaire */}
      <div className="card p-8">
        <LoginForm onSuccess={handleSuccess} />

        {/* Lien mot de passe oublié */}
        <div className="text-center mt-4">
          <Link 
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      {/* Inscription */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas de compte ?{' '}
          <Link 
            href="/register"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </motion.div>
  )
}