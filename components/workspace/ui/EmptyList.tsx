import { cn } from '@/lib'
import { FolderOpen } from 'lucide-react'
import React from 'react'

const EmptyList = ({size,icon,heading,text, className, CTA}:{
    size?:string|number,icon?:React.ReactNode,text?:string,heading?:string, className?:string, CTA?:React.ReactNode
}) => {
  return (
    <div className={cn("h-96 w-full flex  text-center flex-col gap-2 justify-center items-center",className)}>
      
       {icon || <FolderOpen size={size||60} className='text-purple-100'/>}

       {heading ? <h2 className='   text-2xl font-bold' style={{
        background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>{heading}</h2> : null} 
        <p className="max-w-sm text-slate-600">{text || 'No items found'}</p>
        {CTA}
    </div>
  )
}

export default EmptyList
