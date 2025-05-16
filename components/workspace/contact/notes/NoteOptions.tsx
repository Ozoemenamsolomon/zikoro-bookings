import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { Button } from '@/components/ui/button'
import { BookOpen, Edit, EllipsisVertical, MoreVertical, PenLine, PlusCircle, Trash } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import AddNote from './AddNote'
import { AppointmentNotes, BookingNote, BookingNoteInput } from '@/types/appointments'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { CenterModal } from '@/components/shared/CenterModal'
import DeleteCard from '@/components/shared/DeleteCard'

const NoteOptions = ({note, insertNote, updateNote, deleteNote}:{
    note:BookingNote,
    insertNote:(k:BookingNoteInput)=>Promise<string>
    deleteNote:(k:number)=>Promise<void>
    updateNote:(k:BookingNoteInput)=>Promise<string>
    }
) => {
    const [open, setOpen] = useState(false)
    const { contact} = useAppointmentContext()
 
  return (
    <PopoverMenu
        isOpen={open}
        onOpenChange={setOpen}
        className="w-28 p-2 space-y-1 text-sm"
        align="end"
        trigerBtn={
            <button  className="flex items-center justify-center h-6 w-6 border rounded-full bg-white"><EllipsisVertical size={14} /></button>
        }
      >
        <>
        <CenterModal
            onOpenChange={setOpen}
            trigerBtn={
                <button  className="w-full px-2 py-0.5 hover:bg-slate-100 rounded-md bg-white flex gap-1 items-center "><Edit size={14} className='shrink-0'/> Edit</button>
            }
        >
            <AddNote insertNote={insertNote} updateNote={updateNote} contact={contact!} editNote={note}/>
        </CenterModal>

        <DeleteCard 
          onDelete={async ()=>{await deleteNote(note.id!)}} 
          trigger={
            <button className="w-full px-2 py-0.5 hover:bg-slate-100 rounded-md bg-white flex gap-1 items-center "><Trash size={14} className='shrink-0'/> Delete</button>
          }
          />

        <CenterModal
            onOpenChange={setOpen}
            trigerBtn={
            <button className="w-full px-2 py-0.5 hover:bg-slate-100 rounded-md bg-white flex gap-1 items-center "><BookOpen size={14} className='shrink-0'/> Preview</button>
            }
        >
            <AddNote insertNote={insertNote} updateNote={updateNote} contact={contact!} editNote={note} isPreview={true}/>
        </CenterModal>
        </>
    </PopoverMenu>
  )
}

export default NoteOptions