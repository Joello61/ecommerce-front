// src/app/(auth)/reset-password/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, AlertCircle } from 'lucide-react'
import { ResetPasswordForm } from '@/components/features/auth/ResetPasswordForm'
import { useAuthStore } from '@/store'
import Loading from '@/components/ui/Loading'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const verifyResetToken = useAuthStore(state => state.verifyResetToken)
  
  const [token, setToken] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    
    if (!tokenParam) {
      setIsValidating(false)
      return
    }

    setToken(tokenParam)

    // Vérifier la validité du token
    const validateToken = async () => {
      try {
        const valid = await verifyResetToken(tokenParam)
        setIsValid(valid)
      } catch {
        setIsValid(false)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [searchParams, verifyResetToken])

  const handleSuccess = () => {
    router.push('/login?reset=success')
  }

  // Chargement de la validation
  if (isValidating) {
    return (
      <div className="w-full">
        <div className="card p-8">
          <Loading 
            size="lg" 
            text="Vérification du lien..." 
            centered 
          />
        </div>
      </div>
    )
  }

  // Token manquant ou invalide
  if (!token || !isValid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 mb-4">
            <AlertCircle className="h-8 w-8 text-danger" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Lien invalide ou expiré</h2>
          <p className="text-muted-foreground mb-6">
            Ce lien de réinitialisation n&apos;est plus valide. Il a peut-être expiré ou a déjà été utilisé.
          </p>
          
          <button
            onClick={() => router.push('/forgot-password')}
            className="btn-primary"
          >
            Demander un nouveau lien
          </button>
        </div>
      </motion.div>
    )
  }

  // Formulaire de réinitialisation
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
          <Lock className="h-8 w-8 text-white" />
        </motion.div>
        
        <h1 className="text-3xl font-bold mb-2">Nouveau mot de passe</h1>
        <p className="text-muted-foreground">
          Choisissez un mot de passe sécurisé pour votre compte
        </p>
      </div>

      {/* Formulaire */}
      <ResetPasswordForm 
        token={token}
        onSuccess={handleSuccess}
      />
    </motion.div>
  )
}