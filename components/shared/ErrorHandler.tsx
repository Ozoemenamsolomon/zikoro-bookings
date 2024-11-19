'use client'
import { Button } from '@/components/ui/button'
import { FileStroke, } from '@/constants'
import { useRouter } from 'next/navigation'
import React from 'react'

const ErrorHandler = () => {
  const {refresh} = useRouter()
  return (
    <section className="h-screen bg-white w-full flex pt-24  items-center flex-col gap-3 text-center">
        <FileStroke/>
        <h4 className="text-lg font-bold">
          Thers was error while fetching data
        </h4>
        <p>Check your network and refresh the page.</p>

         <Button className='bg-basePrimary' onClick={()=>refresh()}>Refresh</Button>
    </section>
  )
}

export default ErrorHandler