import { cn } from '@/lib/utils'
import React from 'react'

const LoadingState = ({className}:{className?:string}) => {
  return (
    <div className={cn('w-full h-40 bg-baseBg animate-pulse',className)}></div>
  )
}

export default LoadingState