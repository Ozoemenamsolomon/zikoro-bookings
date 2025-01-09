import { GoalProvider } from '@/context/AnalyticsContext'
import React from 'react'

const layout =({ children }: { children: React.ReactNode }) => {
  return (
    <GoalProvider>
      <main className="max-w-4x mx-auto">
        {children}
      </main>
    </GoalProvider>
  )
}

export default layout