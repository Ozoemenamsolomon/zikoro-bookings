'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";
import { X } from "lucide-react";
import { useAppointmentContext } from "@/context/AppointmentContext";

interface Modal {
  trigerBtn: React.ReactNode
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}
export const CenterModal = ({
  trigerBtn = <Button variant="outline">Open</Button>,
  children,
  className,
  isOpen,
  onOpenChange,
  disabled,
}: Modal) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger disabled={disabled} asChild>
        {trigerBtn}
      </DialogTrigger>
      <DialogContent className={cn("p-0 w-full overflow-hidden max-w-4xl",className)}>
        <div className={cn("p-0 w-full max-h-screen sm:max-h-[90vh] overflow-auto no-scrollbar", className)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}


type CustomModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  children: React.ReactNode
  disabled?: boolean
  trigerBtn?: React.ReactNode
}

export const CustomModal = ({
  isOpen,
  onOpenChange,
  className,
  children,
  disabled = false,
  trigerBtn = <button className="btn">Open</button>,
}: CustomModalProps) => {
  return (
    <>
      {/* Trigger Button */}
      <div
        onClick={() => {
          if (!disabled) onOpenChange(true)
        }}
        className={disabled ? 'opacity-50 pointer-events-none' : ''}
      >
        {trigerBtn}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div
            className={cn(
              'bg-white rounded-xl shadow-lg w-full max-w-4xl relative animate-fadeIn  overflow-hidden  max-h-screen sm:max-h-[80vh] ',
              className
            )}
          >
            {/* Close Button */}
            <button onClick={()=>onOpenChange(false)} 
              type="button" className='absolute right-2 top-2 bg-black text-white rounded-full h-7 w-7 flex  justify-center items-center z-10'><X size={16}/></button>

            {/* Modal Content */}
            {children}
          </div>
        </div>
      )}
    </>
  )
}



export const TopModal = ({
  className,
  children,
  callback,
}: {  
  className?: string, 
  callback?: (key?:boolean)=>void,
  children: React.ReactNode
}) => {
  const {isOpen, setIsOpen,} = useAppointmentContext()
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div
            className={cn(
              'bg-white rounded-xl shadow-lg w-full max-w-4xl relative animate-fadeIn  overflow-hidden  max-h-screen sm:max-h-[80vh] ',
              className
            )}
          >
            {/* Close Button */}
            <button onClick={()=>{
              callback && callback()
              setIsOpen(false)}} 
              type="button" className='absolute right-2 top-2 bg-black text-white rounded-full h-7 w-7 flex  justify-center items-center z-10'><X size={16}/></button>

            {/* Modal Content */}
            {children}
          </div>
        </div>
      )}
    </>
  )
}
