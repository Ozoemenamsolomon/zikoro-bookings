'use client'
import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { deleteRequest } from '@/utils/api'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const DeleteContact = () => {
    const {contact,contacts, setContact,setContacts } = useAppointmentContext()

    const [loading, setLoading] = useState(false)
    const [isHidden, setIsHidden ] = useState('')

    const deleteContact = async () => {
            try {
                setLoading(true)
                const {data:{data,error}} = await deleteRequest({endpoint:`/bookingsContact/deleteContact?id=${contact?.id}`})
                
                if(!error) {
                    let list = contacts?.filter((item)=> item?.id !== contact?.id)

                    setContacts(list!)
                    setContact(list?.[0]!)

                    toast.success('Contact deleted')
                    setIsHidden('hidden')
                    // refresh()
                } else {
                    throw error
                }
            } catch (error) {
                toast.error('An Error occured! Check your network.')
                console.log(error)
            } finally {
                setLoading(false)
            }
    }

  return (
    <div className="  border rounded-md space-y-3">
        <div className="text-center  rounded-md w-full p-4 border-b font-semibold bg-baseBg">Delete contact</div>

        <div className="p-3">
            <p className="pb-2   text-center">Delete this contact from your contact list</p>
            <PopoverMenu
                className={isHidden}
                trigerBtn={
                    <button onClick={()=>setIsHidden('')} className="text-center rounded-md w-full p-3 bg-red-600 text-white">Delete contact</button>
                }
            >
                <div className="w-full p-4 py-6 rounded-lg">
                    <p className="text-center mb-2 text-red-600 w-60 mx-auto">Are you sure you want to delete this contact!</p>
                    <button 
                    onClick={deleteContact}
                    disabled={loading}
                    className="text-center disabled:cursor-not-allowed  rounded-md w-full p-3 border border-red-600 text-red-600 ">
                       {loading ? 'Deleting contact...' : 'Delete contact'}
                    </button>
                </div>
            </PopoverMenu>
        </div>
        
    </div>
  )
}

export default DeleteContact