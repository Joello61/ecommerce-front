import { Metadata } from 'next'
import { AuthGuard } from '@/components/providers'
import { AccountSidebar } from '@/components/account/account-sidebar'

export const metadata: Metadata = {
  title: 'Mon Compte',
  description: 'Gérez votre compte, vos commandes et vos préférences',
  robots: {
    index: false,
    follow: false,
  },
}

interface AccountLayoutProps {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <AuthGuard redirectTo="/login">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Navigation compte */}
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>
          
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}