'use client'

import { Suspense, lazy, useState } from 'react'
import { Loader2 } from 'lucide-react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (err: Error) => {
    console.error('Spline scene error:', err)
    setError(err)
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-secondary">
        <div className="text-lg mb-2">Unable to load 3D scene</div>
        <div className="text-sm">Please check if WebGL is enabled in your browser</div>
      </div>
    )
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      }
    >
      <ErrorBoundary onError={handleError}>
        <Spline
          scene={scene}
          className={className}
          onError={handleError}
        />
      </ErrorBoundary>
    </Suspense>
  )
}

class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  onError: (error: Error) => void
}> {
  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    return this.props.children
  }
}