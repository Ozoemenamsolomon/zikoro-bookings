import { cn } from '@/lib';
import React from 'react'

const MessageModal = ({onClose,className,children}:{className?:string; onClose: () => void; children:React.ReactNode}) => {
  return (
    <div onClick={onClose} className={cn(`w-full absolute inset-0 bg-slate-100/50 flex flex-col h-full px-6 py-10 rounded-lg shadow-md  justify-center items-center`,className)}>
        <div className="flex flex-col border bg-white rounded-2xl shadow p-8 min-h-44 items-center justify-center gap-4 text-center w-full max-w-md">
            {children}
        </div>
    </div>
  )
}

export default MessageModal