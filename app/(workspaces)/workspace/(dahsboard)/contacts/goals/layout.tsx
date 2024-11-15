import { GoalProvider } from '@/context/GoalContext'
import React from 'react'

const layout =({ children }: { children: React.ReactNode }) => {
  return (
    <GoalProvider>
        {children}
    </GoalProvider>
  )
}

export default layout