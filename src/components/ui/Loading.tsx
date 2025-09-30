import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse'
  text?: string
  overlay?: boolean
  centered?: boolean
}

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number
  avatar?: boolean
  width?: string
  height?: string
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
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const textSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const renderSpinner = () => (
    <svg className={cn('animate-spin text-primary', sizeMap[size])} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )

  const renderDots = () => {
    const dotSizeMap = {
      sm: 'w-1 h-1',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    }

    return (
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn('rounded-full bg-primary animate-pulse', dotSizeMap[size])}
            style={{ animationDelay: `${i * 200}ms`, animationDuration: '1s' }}
          />
        ))}
      </div>
    )
  }

  const renderPulse = () => (
    <div className={cn('rounded-full bg-primary animate-pulse', sizeMap[size])} />
  )

  const loader = {
    spinner: renderSpinner(),
    dots: renderDots(),
    pulse: renderPulse()
  }[variant]

  const content = (
    <div className={cn('flex items-center gap-3', centered && 'justify-center', className)} {...props}>
      {loader}
      {text && <span className={cn('text-gray-600', textSizeMap[size])}>{text}</span>}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="card p-6 shadow-xl">{content}</div>
      </div>
    )
  }

  return content
}

// Skeleton simple et efficace
const Skeleton = ({ lines = 3, avatar = false, width, height, className, ...props }: SkeletonProps) => (
  <div className={cn('animate-pulse', className)} {...props}>
    <div className="flex gap-4">
      {avatar && <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />}
      <div className="flex-1 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('h-4 bg-gray-200 rounded', i === lines - 1 && 'w-3/4')}
            style={{ width: width && i === 0 ? width : undefined, height: height || undefined }}
          />
        ))}
      </div>
    </div>
  </div>
)

// Composants utilitaires
const PageLoading = ({ text = 'Chargement...' }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading size="lg" text={text} centered className="flex-col" />
  </div>
)

const ButtonLoading = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <Loading size={size} variant="spinner" />
)

const CardLoading = ({ lines = 3 }: { lines?: number }) => (
  <div className="card p-6">
    <Skeleton lines={lines} />
  </div>
)

const ProductLoading = () => (
  <div className="card-product p-0 overflow-hidden">
    <div className="h-48 bg-gray-200 animate-pulse" />
    <div className="p-4">
      <Skeleton lines={2} />
    </div>
  </div>
)

Loading.displayName = 'Loading'
Skeleton.displayName = 'Skeleton'

export default Loading
export { Skeleton, PageLoading, ButtonLoading, CardLoading, ProductLoading }