import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}