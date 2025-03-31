import { CenterModal } from '@/components/shared/CenterModal'
import { Edit, MapPin } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import SelectStatus from './SelectStatus'
import Notes from './Notes'
import AddNote from './AddNote'
import { Booking, BookingNote } from '@/types/appointments'
import { DialogTitle } from '@/components/ui/dialog'
import { GroupedBookings } from '@/lib/server/appointments'
import { getInitials } from '@/lib'
import { EditIcon } from '@/constants'
import DeleteNote from './DeleteNote'

const EditAppointment = ({booking, setGroupedBookings}:{
booking:Booking,
setGroupedBookings: Dispatch<SetStateAction<GroupedBookings | null>>
}) => {
    // console.log({booking})
    const {address, appointmentTime, appointmentNotes, bookingStatus,firstName,lastName,notes,participantEmail,phone, workspaceId, appointmentMedia, appointmentLinkId } = booking

    const [selected, setSelected] = useState('Status')
    const [isAddNote, setIsAddNote] = useState<''|'create'|'edit'|'preview'|'delete'>('')
    const [bookingNotes, setBookingNotes] = useState<BookingNote[]>([])

    // TOD: initialString from first word in firstName and lastName 
    const initialStr = getInitials(firstName, lastName);
    return (
    <CenterModal 
        trigerBtn = {
            <button><EditIcon size={21}/></button>
        }
        className='w-full max-w-2xl '
    >
       {
        isAddNote==='delete' ?
        <DeleteNote setIsAddNote={setIsAddNote} setBookingNotes={setBookingNotes} /> 
        :
        <div className="w-full pb-14 ">
            <DialogTitle className="w-full bg-baseLight py-6 px-4 flex justify-between items-center">
                Edit Appontment 
            </DialogTitle>
            
            {
                isAddNote.length>0 ? 
                <AddNote setIsAddNote={setIsAddNote} booking={booking} setBookingNotes={setBookingNotes} isAddNote={isAddNote}  /> 
                :
                <div className="flex flex-col pt-4 gap-1 items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-baseLight shrink-0 flex justify-center items-center font-bold text-xl">
                        {initialStr}
                    </div>
                    <strong className="capitalize">{firstName + " " + lastName}</strong>
                    <small className="font-medium">{participantEmail}</small>
                    <small className="font- flex gap-1 items-center text-gray-600">
                        <MapPin size={14} />
                        {address ? address : "No address provided"}
                    </small>

                    <div className="py-4 flex justify-center items-center">
                        <button onClick={()=>setSelected('Status')} className={`py-2 px-4 border-b-2 font-medium ${selected==='Status'?'border-zikoroBlue':''}`}>Status</button>
                        <button onClick={()=>setSelected('Notes')} className={`py-2 px-4 border-b-2 font-medium ${selected==='Notes'?'border-zikoroBlue':''}`}>Notes</button>
                    </div>

                    {
                        selected==='Status' ?
                        <SelectStatus booking={booking} setGroupedBookings={setGroupedBookings} /> 
                        :
                        <Notes booking={booking} setIsAddNote={setIsAddNote} bookingNotes={bookingNotes} setBookingNotes={setBookingNotes}/>
                    }
                </div>
            }

        </div>
        }
    </CenterModal>
  )
}

export default EditAppointment