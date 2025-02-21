import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { Button } from '@/components/ui/button'
import { EllipsisVertical, MoreVertical } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import AddNote from './AddNote'
import { AppointmentNotes } from '@/types/appointments'
import { useAppointmentContext } from '@/context/AppointmentContext'

const NoteOptions = ({setIsAddNote, note}:{
    setIsAddNote:Dispatch<SetStateAction<boolean>>
    note:AppointmentNotes
    }
) => {

    const {setSelectedItem} = useAppointmentContext()

    const handleEditClick = ( ) => {
        setIsAddNote(true)
        setSelectedItem(note)
    }
    
  return (
    <PopoverMenu
        className="w-48"
        align="end"
        trigerBtn={
            <button  className="flex items-center justify-center h-6 w-6 border rounded-full bg-white"><EllipsisVertical size={14} /></button>
        }
      >
        <div className="bg-white shadow rounded-md p-4 space-y-3 text-sm w-full text-gray-800">
            <button onClick={handleEditClick}  className="w-full  bg-white">Edit note</button>
        </div>
    </PopoverMenu>
  )
}

export default NoteOptions