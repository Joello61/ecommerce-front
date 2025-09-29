// src/app/(auth)/register/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, Shield, Zap, Heart } from 'lucide-react'
import { RegisterForm } from '@/components/features/auth/RegisterForm'

export default function RegisterPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/login?registered=true')
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
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-dark mb-4"
        >
          <UserPlus className="h-8 w-8 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
        <p className="text-muted-foreground">
          Rejoignez Emerald Store et profitez d&apos;avantages exclusifs
        </p>
      </div>

      {/* Avantages rapides */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Shield, label: 'Sécurisé', color: 'text-primary' },
          { icon: Zap, label: 'Rapide', color: 'text-secondary' },
          { icon: Heart, label: 'Gratuit', color: 'text-danger' }
        ].map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="card p-3 text-center"
          >
            <Icon className={`h-6 w-6 mx-auto mb-1 ${color}`} />
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Formulaire */}
      <div className="card p-8">
        <RegisterForm onSuccess={handleSuccess} />
      </div>

      {/* Connexion */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link 
            href="/login"
            className="text-primary font-medium hover:text-primary-dark transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </motion.div>
  )
}