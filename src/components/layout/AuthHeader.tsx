import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function AuthHeader() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="p-2 rounded-lg bg-secondary">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl">ShopName</span>
        </Link>
        
        <Link 
          href="/" 
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </header>
  )
}