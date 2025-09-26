import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  HomeIcon, 
  MagnifyingGlassIcon,
  ShoppingBagIcon, 
} from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <div className="relative w-80 h-80 mx-auto mb-6">
            {/* Illustration SVG simple ou image */}
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-full flex items-center justify-center">
              <div className="text-8xl font-bold text-primary-600 dark:text-primary-400 opacity-50">
                404
              </div>
            </div>
            
            {/* Éléments décoratifs */}
            <div className="absolute top-4 right-4 w-4 h-4 bg-primary-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-8 left-8 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Page introuvable
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Oups ! Il semblerait que la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </div>

          {/* Actions suggérées */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Retour à l&apos;accueil
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">
                  <ShoppingBagIcon className="mr-2 h-5 w-5" />
                  Voir les produits
                </Link>
              </Button>
            </div>

            {/* Barre de recherche */}
            <div className="max-w-md mx-auto">
              <form className="flex gap-2">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <Button type="submit">
                  Rechercher
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Liens utiles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <ShoppingBagIcon className="h-6 w-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <Link 
                  href="/products" 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Produits
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <svg className="h-6 w-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <Link 
                  href="/promotions" 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Promotions
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <svg className="h-6 w-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
                <Link 
                  href="/aide" 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Aide
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <svg className="h-6 w-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <Link 
                  href="/contact" 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Contact
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            💡 <strong>Astuce :</strong> Utilisez notre barre de recherche pour trouver rapidement ce que vous cherchez, 
            ou explorez nos catégories depuis la page d&apos;accueil.
          </p>
        </div>
      </div>
    </div>
  )
}