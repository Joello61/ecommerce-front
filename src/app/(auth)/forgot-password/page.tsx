// src/app/(auth)/forgot-password/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { KeyRound, ArrowLeft } from 'lucide-react'
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Retour */}
      <Link 
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la connexion
      </Link>

      {/* En-tête */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-dark mb-4"
        >
          <KeyRound className="h-8 w-8 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Mot de passe oublié ?</h1>
        <p className="text-muted-foreground">
          Pas de problème, nous vous enverrons les instructions pour le réinitialiser
        </p>
      </div>

      {/* Formulaire */}
      <ForgotPasswordForm 
        onCancel={() => window.location.href = '/login'}
      />

      {/* Info sécurité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
      >
        <p className="text-xs text-muted-foreground text-center">
          Pour votre sécurité, le lien de réinitialisation sera valable pendant 1 heure uniquement
        </p>
      </motion.div>
    </motion.div>
  )
}