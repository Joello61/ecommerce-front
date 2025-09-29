import { cn } from '@/lib/utils'
import type { BaseComponentProps } from '@/types'

interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  text?: string
  overlay?: boolean
  centered?: boolean
}

interface SkeletonProps extends BaseComponentProps {
  lines?: number
  avatar?: boolean
  width?: string | number
  height?: string | number
}

const Loading = ({
  size = 'md',
  variant = 'spinner',
  text,
  overlay = false,
  centered = false,
  className,
  ...props
}: LoadingProps) => {
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-8 w-8'
      case 'xl':
        return 'h-12 w-12'
      default:
        return 'h-6 w-6'
    }
  }

  const getTextSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'xl':
        return 'text-xl'
      default:
        return 'text-base'
    }
  }

  const renderSpinner = () => (
    <svg
      className={cn('animate-spin text-primary', getSizeClass())}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const renderDots = () => (
    <div className={cn('flex space-x-1', getSizeClass())}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary animate-pulse',
            size === 'sm' ? 'h-1 w-1' : 
            size === 'lg' ? 'h-3 w-3' :
            size === 'xl' ? 'h-4 w-4' :
            'h-2 w-2'
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <div
      className={cn(
        'rounded-full bg-primary animate-pulse',
        getSizeClass()
      )}
    />
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'skeleton':
        return <Skeleton />
      default:
        return renderSpinner()
    }
  }

  const content = (
    <div
      className={cn(
        'flex items-center gap-3',
        centered && 'justify-center',
        className
      )}
      {...props}
    >
      {variant !== 'skeleton' && renderLoader()}
      {text && (
        <span className={cn('text-slate-600 dark:text-slate-400', getTextSizeClass())}>
          {text}
        </span>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
          {content}
        </div>
      </div>
    )
  }

  return content
}

const Skeleton = ({
  lines = 3,
  avatar = false,
  width,
  height,
  className,
  ...props
}: SkeletonProps) => {
  return (
    <div className={cn('animate-pulse', className)} {...props}>
      <div className="flex items-start space-x-4">
        {/* Avatar skeleton */}
        {avatar && (
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10 flex-shrink-0" />
        )}
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-slate-200 dark:bg-slate-700 rounded',
                i === lines - 1 && 'w-3/4', // Dernière ligne plus courte
                width && i === 0 && `w-[${width}]`,
                height && `h-[${height}]`
              )}
              style={{
                width: width && i === 0 ? width : undefined,
                height: height ? height : undefined
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Composant pour les pages en chargement
const PageLoading = ({ text = 'Chargement...' }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading 
      size="lg" 
      text={text} 
      centered 
      className="flex-col"
    />
  </div>
)

// Composant pour les boutons en chargement
const ButtonLoading = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <Loading 
    size={size} 
    variant="spinner"
    className="mr-2"
  />
)

// Composant pour les cartes en chargement
const CardLoading = ({ lines = 3 }: { lines?: number }) => (
  <div className="card p-6">
    <Skeleton lines={lines} />
  </div>
)

// Composant pour les produits en chargement
const ProductLoading = () => (
  <div className="card-product p-0 overflow-hidden">
    <div className="h-48 bg-slate-200 dark:bg-slate-700 animate-pulse" />
    <div className="p-4">
      <Skeleton lines={2} />
    </div>
  </div>
)

Loading.displayName = 'Loading'
Skeleton.displayName = 'Skeleton'

export default Loading
export { 
  Skeleton, 
  PageLoading, 
  ButtonLoading, 
  CardLoading, 
  ProductLoading 
}