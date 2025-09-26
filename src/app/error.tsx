'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur dans un service de monitoring (Sentry, LogRocket, etc.)
    console.error('Application Error:', error)
    
    // En production, vous pourriez envoyer l'erreur à votre service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // Exemple avec une API de logging
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        })
      }).catch(() => {
        // Ignorer les erreurs de logging pour éviter les boucles
      })
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Icône d'erreur */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Nous sommes désolés, quelque chose s&apos;est mal passé. Notre équipe a été automatiquement notifiée du problème.
            </p>
          </div>

          {/* Détails de l'erreur en mode développement */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="text-left bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                  Détails de l&apos;erreur (développement uniquement) :
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ID d&apos;erreur: {error.digest}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={reset}>
                <ArrowPathIcon className="mr-2 h-5 w-5" />
                Réessayer
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Retour à l&apos;accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 space-y-6">
          {/* Suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Que pouvez-vous faire ?
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
              <li>• Actualisez la page (bouton &quot;Réessayer&quot;)</li>
              <li>• Vérifiez votre connexion internet</li>
              <li>• Essayez dans quelques minutes</li>
              <li>• Videz le cache de votre navigateur</li>
            </ul>
          </div>

          {/* Contact support */}
          <Card>
            <CardContent className="p-6 text-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-3 text-primary-600 dark:text-primary-400" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Le problème persiste ?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Notre équipe support est disponible pour vous aider
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">
                    Nous contacter
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/aide">
                    Centre d&apos;aide
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statut du service */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>
              Vous pouvez vérifier l&apos;état de nos services sur notre{' '}
              <Link 
                href="/status" 
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                page de statut
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}