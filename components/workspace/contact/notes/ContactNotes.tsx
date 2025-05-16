'use client'
import { BlockSlotSkeleton } from '@/components/shared/Loader'
import PaginationMain from '@/components/shared/PaginationMain'
import { Calendar } from '@/constants'
import { useBookingsNotes } from '@/hooks/services/appointments'
import { BookingNote } from '@/types/appointments'
import { FolderOpen, PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import EmptyList from '../../ui/EmptyList'
import { CenterModal } from '@/components/shared/CenterModal'
import AddNote from './AddNote'
import { useAppointmentContext } from '@/context/AppointmentContext'
import NoteCard from './NoteCard'

const ContactNotes = ({notes,error,count, contactId}:{notes:BookingNote[]|null, error:null|string, count:null|number, contactId:string}) => {
    const { contactNotes, error:notesError, totalPages, currentPage, handlePageChange, loading, insertNote, updateNote, deleteNote} = useBookingsNotes({notes,err:error,tableSize:count, contactId})

    const [open, setOpen] = useState(false)
    const { contact,   } = useAppointmentContext();

  return (
    <section className='md:p-3'>
        <div className="md:border md:rounded-lg bg-white flex-col h-full justify-between">
            <div className="pb-6">

                <header className="">
                    <h4 className=" w-full  py-4 text-center border-b bg-baseBg font-semibold text-lg">Notes</h4>

                    <div className="w-full text-center py-4 md:px-4 flex justify-between items-center">
                        <div className="">
                            {/* <button className="border py-1 px-2 rounded-md flex gap-2 items-center text-slate-600">
                                <div className="bg-baseLight p-2 rounded-full"><Calendar/></div>
                                <p>Go to date</p>
                            </button> */}
                        </div>
                        <div className="">
                            <CenterModal
                                isOpen={open}
                                onOpenChange={setOpen}
                                trigerBtn={
                                    <button type="button" className='flex items-center gap-4 px-4 py-2 rounded-md bg-basePrimary text-white'>
                                        <PlusCircle />
                                        <p className="">Add Note</p>
                                    </button>
                                }
                            >
                                <AddNote insertNote={insertNote} updateNote={updateNote} contact={contact!}/>
                            </CenterModal>


                        </div>
                    </div>
                </header>

                <div className="notes  ">
                    {
                        loading ?
                        <section className="min-h-[80vh] grid sm:grid-cols-2 md:grid-cols- md:px-4 gap-4 ">
                            <BlockSlotSkeleton size={4} className='h-56'/> 
                        </section>
                        :
                        notesError ? 
                        <div className="min-h-[70vh]  w-full flex gap-2 justify-center ">
                            <EmptyList text={notesError || 'Unknown error occured, check your network and try again'}/>
                        </div>
                        :
                        contactNotes?.length ? 
                            <div className="min-h-[70vh]   ">
                            <div className="  grid sm:grid-cols-2 md:px-4 gap-4 ">
                                {
                                    contactNotes.map((_,idx)=>{
                                        return (
                                            <NoteCard key={idx} note={_} insertNote={insertNote} updateNote={updateNote} deleteNote={deleteNote}/>
                                        )
                                    })
                                }
                            </div>
                            </div>
                        : 
                        <div className="min-h-[70vh]  w-full flex gap-2 justify-center ">
                            <EmptyList text={notesError || 'No item was found'}/>
                        </div>
                    }
                    
                </div>
            </div>

            <div className="border-t w-full pb-4">
                <PaginationMain totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>

        </div>
    </section>
  )
}

export default ContactNotes


