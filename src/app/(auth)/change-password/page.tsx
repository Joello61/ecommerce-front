// src/app/(auth)/change-password/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { ChangePasswordForm } from '@/components/features/auth/ChangePasswordForm'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function ChangePasswordPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/change-password')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="card p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleSuccess = () => {
    router.push('/profile?password=changed')
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Retour */}
      <Link 
        href="/profile"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au profil
      </Link>

      {/* En-tête */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-success to-emerald-700 mb-4"
        >
          <ShieldCheck className="h-8 w-8 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Changer le mot de passe</h1>
        <p className="text-muted-foreground">
          Mettez à jour votre mot de passe pour sécuriser votre compte
        </p>
      </div>

      {/* Formulaire */}
      <ChangePasswordForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />

      {/* Conseils de sécurité */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
      >
        <h3 className="text-sm font-semibold mb-2">Conseils pour un mot de passe sécurisé :</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Utilisez au moins 8 caractères</li>
          <li>• Mélangez majuscules, minuscules, chiffres et symboles</li>
          <li>• Évitez les informations personnelles</li>
          <li>• N&apos;utilisez pas le même mot de passe ailleurs</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}