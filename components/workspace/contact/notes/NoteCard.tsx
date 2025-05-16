import { renderAttachment } from '@/components/shared/Fileuploader'
import React, { Dispatch, SetStateAction } from 'react'
import NoteOptions from './NoteOptions'
import { BookingNote, BookingNoteInput } from '@/types/appointments'
import EmptyList from '../../ui/EmptyList'
import { NoMediaIcon } from '@/constants'
import { format } from 'date-fns'
import { getInitials } from '@/lib'

const NoteCard = ({note, insertNote, updateNote, deleteNote}:{
    note:BookingNote,
    insertNote:(k:BookingNoteInput)=>Promise<string>
    updateNote:(k:BookingNoteInput)=>Promise<string>
    deleteNote:(k:number)=>Promise<void>
}) => {
    const initialStr = getInitials(
                            note?.createdBy?.firstName ?? '',
                            note?.createdBy?.lastName ?? ''
                          );
  return (
    <div className="border rounded-md ">
        <div className="flex p-3 gap-3 items-center border-b pb-1">
        <h6 className="font-semibold capitalize flex-1">{note.title}</h6>
            <NoteOptions  note={note} insertNote={insertNote} updateNote={updateNote} deleteNote={deleteNote} />
        </div>
        <div
        dangerouslySetInnerHTML={{ __html: note.note || '' }}
        className="prose p-3 text-xs max-h-40 overflow-auto hide-scrollbar"
        />

      <div className="p-3">
            <div className="w-full border py-1.5 rounded-sm overflow-auto no-scrollbar">
                <h6 className="font-medium text-xs pb-1 pl-1 ">Media</h6>
                <div className="w-full flex gap-1 items-center ">
                {
                    !note?.media?.length  ? 
                    <EmptyList
                    icon={<NoMediaIcon size={20} />}
                    className='h-8 text-[12px] flex flex-row'
                    text='No file found'
                    /> :
                    note?.media?.map(({url,type},i)=>{
                    return (
                        <div key={i} className="h-16 w-16">
                            {renderAttachment(url,type)}
                        </div>
                    )
                })
                }
                </div>
            </div>
        </div> 

        <div className=" rounded-md ">
        <div className="flex p-3 border-b bg-zinc-50 w-full gap-3 items-center">
        <div className="h-10 w-10 shrink-0 bg-baseLight rounded-full flex justify-center items-center font-semibold">
            {initialStr}
        </div>
        <div className="flex-1">
        <p className=' capitalize'>{note.createdBy?.firstName + " " + note.createdBy?.lastName}</p>
        <small className="text-gray-500">{note.createdBy?.userEmail}</small>
        </div>
        </div>

        <div className="p-3  ">
        <div className="flex gap-3 items-center">
        <small className="text-zinc-700">Added on:</small>
        <small className="text-zinc-500">{
            format(note?.created_at ? new Date(note?.created_at!) : new Date(), 'MMM dd yyyy' )}</small>
        </div>
        <div className="flex gap-3 items-center">
        <small className="text-zinc-700">Last Edited:</small>
        <small className="text-zinc-500">{
            format(note?.lastEditDate ? new Date(note?.lastEditDate!) : new Date(), 'MMM dd yyyy' )}</small>
        </div>
        </div>
        </div>

    </div>
  )
}

export default NoteCard