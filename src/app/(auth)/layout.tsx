// src/app/(auth)/layout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header minimaliste */}
      <header className="w-full border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container flex items-center justify-between py-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="font-heading font-semibold text-xl">Emerald Store</span>
          </Link>
          
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      {/* Contenu principal centré */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="w-full border-t border-border/50 backdrop-blur-sm bg-background/80 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Emerald Store. Tous droits réservés.
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href="/about" className="hover:text-foreground transition-colors">
              À propos
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}