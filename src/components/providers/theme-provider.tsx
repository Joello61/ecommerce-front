'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// ===========================================
// THEME TOGGLE BUTTON COMPONENT
// ===========================================

import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ThemeToggleProps {
  /**
   * Affichage du toggle
   */
  variant?: 'button' | 'dropdown' | 'inline'
  
  /**
   * Taille du bouton
   */
  size?: 'sm' | 'default' | 'lg'
  
  /**
   * Classe CSS personnalisée
   */
  className?: string
  
  /**
   * Si true, affiche le texte avec l'icône
   */
  showLabel?: boolean
}

export function ThemeToggle({ 
  variant = 'button', 
  size = 'default', 
  className,
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  // Éviter l'hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon'}
        className={className}
        disabled
      >
        <SunIcon className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }
  
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-4 w-4" />
      case 'dark':
        return <MoonIcon className="h-4 w-4" />
      case 'system':
        return <ComputerDesktopIcon className="h-4 w-4" />
      default:
        return resolvedTheme === 'dark' 
          ? <MoonIcon className="h-4 w-4" />
          : <SunIcon className="h-4 w-4" />
    }
  }
  
  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Clair'
      case 'dark':
        return 'Sombre'
      case 'system':
        return 'Système'
      default:
        return resolvedTheme === 'dark' ? 'Sombre' : 'Clair'
    }
  }
  
  if (variant === 'inline') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center gap-2 px-2 py-1 rounded-md text-sm',
          'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
          className
        )}
      >
        {getIcon()}
        {showLabel && <span>{getLabel()}</span>}
      </button>
    )
  }
  
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size={size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon'}
          onClick={toggleTheme}
          className={className}
        >
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    )
  }
  
  return (
    <Button
      variant="ghost"
      size={size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : showLabel ? 'default' : 'icon'}
      onClick={toggleTheme}
      className={className}
    >
      {getIcon()}
      {showLabel && <span className="ml-2">{getLabel()}</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// ===========================================
// THEME DETECTION HOOK
// ===========================================

export function useThemeDetection() {
  const { theme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  return {
    mounted,
    theme,
    resolvedTheme,
    systemTheme,
    isDark: mounted ? resolvedTheme === 'dark' : false,
    isLight: mounted ? resolvedTheme === 'light' : true,
    isSystem: theme === 'system'
  }
}