import { cn } from '@/lib/utils'
import React from 'react'
import Aside from './Aside'
import Article from './Article'

interface MainProp {
    className?:string,
    navlinks?: any[],
    children: React.ReactNode
}

const SettingsMain:React.FC<MainProp> = ({className, children}) => {

  return (
    <main className={cn("w-full flex-1 min-h-screen md:flex gap-0 bg-white border rounded-lg",className)}>
        <Aside 
            className='shrink-0 bg-white z-10 border-r sticky top-0 md:flex md:flex-col md:h-screen md:py-8 md:px-4 p-2 max-sm:overflow-auto hide-scrollbar'
        />
        <Article className='flex-1 h-full p-6'>
            {children}
        </Article>
    </main>
  )
}

export default SettingsMain