import { cn } from '@/lib'
import { FolderOpen } from 'lucide-react'
import React from 'react'

const EmptyList = ({size,icon,text, className}:{
    size?:string,icon?:React.ReactNode,text?:string, className?:string
}) => {
  return (
    <div className={cn("h-96 w-full flex flex-col gap-2 justify-center items-center",className)}>
       {icon || <FolderOpen size={size||60} className='text-purple-100'/>}
        <p className="max-w-sm text-center text-slate-600">{text || 'No items found'}</p>
    </div>
  )
}

export default EmptyList
