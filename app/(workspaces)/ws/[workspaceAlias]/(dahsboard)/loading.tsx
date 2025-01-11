import { Loader2Icon } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <section className='inset-0 min-h-screen relative flex justify-center items-center'>
      <Loader2Icon className='animate-spin text-zikoroBlue'/>
    </section >
  )
}

export default loading