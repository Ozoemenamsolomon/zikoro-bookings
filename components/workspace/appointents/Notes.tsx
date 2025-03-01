import {  NoFileIcon, NoMediaIcon } from '@/constants'
import { Booking, BookingNote, User,   } from '@/types/appointments'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import EmptyList from '../ui/EmptyList'
import NoteOptions from './NoteOptions'
import { getInitials } from '@/lib'
import { format } from 'date-fns'
import { renderAttachment } from '@/components/shared/Fileuploader'
import { BlockSlotSkeleton } from '@/components/shared/Loader'

const Notes = ({setIsAddNote, booking, bookingNotes, setBookingNotes}:{
    setIsAddNote:Dispatch<SetStateAction<''|'create'|'edit'|'preview'|'delete'>>
    booking:Booking,
    bookingNotes: BookingNote[],
    setBookingNotes: Dispatch<SetStateAction<BookingNote[]>>
}) => {
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState('')
    
    const fetchNotes = async () => {
        setError('')
        try {
            setIsFetching(true)
            const response = await fetch(`/api/appointments/notes/?bookingId=${booking.id}`)
            const {data,error,count} = await response.json()
            setBookingNotes(data)
            setError(error ? 'Unable to fetch notes' : '')
        } catch (error) {
            console.log(error)
            setError('Server error! Refresh this page')
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [])
    // console.log({bookingNotes})
  return (
    <div className='w-full max-w-lg grid gap-y-4 text-start text-[12px]'>
        <div className="px-3 py-3 text-[13px] border rounded-md w-full grid">
            <h6 className="font-semibold text-center  pb-2">Notes from guest</h6>
             {
                booking?.notes ?
                booking.notes :
                <EmptyList
                    icon={<NoFileIcon/>}
                    className='h-24 text-[12px]'
                    text='No note from guest'
                /> 
             }
        </div>
        
        {
            isFetching?
                <div className="h-60 flex items-center justify-center"><BlockSlotSkeleton /></div> :
            error ? 
                <div className='text-center text-red-600 py-24 w-full' >{error}</div> :
            <div className="grid sm:grid-cols-2 gap-2 ">
            {
                bookingNotes?.map((item,idx)=>{
                    const initialStr = getInitials(
                        item?.createdBy?.firstName ?? '',
                        item?.createdBy?.lastName ?? ''
                      );
                                          
                    return (
                        <div key={idx} className="border rounded-md  space-y- ">
                            <div className="flex p-2 gap-2 items-center border-b pb-1">
                                <h6 className="font-semibold capitalize flex-1">{item.title}</h6>
                                <NoteOptions setIsAddNote={setIsAddNote} note={item} />
                            </div>
                            <div
                                dangerouslySetInnerHTML={{ __html: item.note || '' }}
                                className="prose p-2 text-xs max-h-24 overflow-auto hide-scrollbar"
                            />

                            <div className="p-2">
                                <div className="w-full border py-1.5 rounded-sm overflow-auto no-scrollbar">
                                <h6 className="font-medium pb-1 pl-1 ">Media</h6>
                                <div className="w-full flex gap-1 items-center ">
                                    {
                                         !item?.media?.length  ? 
                                         <EmptyList 
                                            icon={<NoMediaIcon size={20} />}
                                            className='h-16 text-[12px]'
                                            text='No file found'
                                         /> :
                                         item?.media?.map(({url,type},i)=>{
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

                            <div className=" rounded-md">
                                <div className="flex p-1 border-b bg-zinc-50 w-full gap-2 items-center">
                                    <div className="h-10 w-10 shrink-0 bg-baseLight rounded-full flex justify-center items-center font-semibold">
                                        {initialStr}
                                    </div>
                                    <div className="flex-1">
                                        <p className=' capitalize'>{item.createdBy?.firstName + " " + item.createdBy?.lastName}</p>
                                        <small className="text-gray-500">{item.createdBy?.userEmail}</small>
                                    </div>
                                </div>

                                <div className="p-2  ">
                                    <div className="flex gap-2 items-center">
                                        <small className="text-zinc-700">Added on:</small>
                                        <small className="text-zinc-500">{
                                        format(item?.created_at ? new Date(item?.created_at!) : new Date(), 'MMM dd yyyy' )}</small>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <small className="text-zinc-700">Last Edited:</small>
                                        <small className="text-zinc-500">{
                                        format(item?.lastEditDate ? new Date(item?.lastEditDate!) : new Date(), 'MMM dd yyyy' )}</small>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                })
            }
            
            </div>
        }
        <div className="flex justify-center pt-4">
            <button onClick={()=>setIsAddNote('create')} className="bg-basePrimary text-white py-2 px-6 text-sm rounded-md font-medium">Add Note</button>
        </div>
    </div>
  )
}

export default Notes