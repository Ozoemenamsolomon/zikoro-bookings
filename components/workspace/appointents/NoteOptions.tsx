import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { Button } from '@/components/ui/button'
import { BookOpen, Edit, EllipsisVertical, MoreVertical, PenLine, Trash } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import AddNote from './AddNote'
import { AppointmentNotes, BookingNote } from '@/types/appointments'
import { useAppointmentContext } from '@/context/AppointmentContext'

const NoteOptions = ({setIsAddNote, note}:{
    setIsAddNote:Dispatch<SetStateAction<''|'create'|'edit'|'preview'|'delete'>>
    note:BookingNote
    }
) => {

    const {setSelectedItem} = useAppointmentContext()

    const handleClick = (type:''|'create'|'edit'|'preview'|'delete') => {
        setIsAddNote(type)
        setSelectedItem(note)
    }
    
  return (
    <PopoverMenu
        className="w-28 p-2 space-y-1 text-sm"
        align="end"
        trigerBtn={
            <button  className="flex items-center justify-center h-6 w-6 border rounded-full bg-white"><EllipsisVertical size={14} /></button>
        }
      >
        <>
            <button onClick={()=>handleClick('edit')}  className="w-full px-2 py-0.5 hover:bg-slate-100 rounded-md bg-white flex gap-1 items-center "><Edit size={14} className='shrink-0'/> Edit</button>
            <button onClick={()=>handleClick('preview')}  className="w-full px-2 py-0.5 hover:bg-slate-100 rounded-md bg-white flex gap-1 items-center "><BookOpen size={14} className='shrink-0'/> Preview</button>
            <button onClick={()=>handleClick('delete')}  className="w-full px-2 py-0.5 hover:bg-slate-100 rounded-md bg-white flex gap-1 items-center "><Trash size={14} className='shrink-0'/> Delete</button>
        </>
    </PopoverMenu>
  )
}

export default NoteOptions