'use client'

import React, { useEffect, useMemo } from 'react'
import { Copy, Loader2Icon, Mail, PhoneCall, X } from 'lucide-react'
import Link from 'next/link'
import { Whatsapp } from 'styled-icons/fa-brands'
import { format } from 'date-fns'
import EditContact from './EditContact'
import { useAppointmentContext } from '@/context/AppointmentContext'
import EmptyList from '../ui/EmptyList'
import CopyLinkButton from '../ui/CopyLinkButton'
import ContactTags from './ContactTags'
import DeleteContact from './DeleteContact'
import Image from 'next/image'

const Articleone = ( ) => {
    const {contact, isfetching, } = useAppointmentContext()

    if(isfetching) return (
        <div className="w-full h-screen  bg-white">
            <div className="h-80 flex flex-col justify-center items-center">
              <Loader2Icon className='animate-spin text-basePrimary/50 ' />
            </div>
        </div>
    )
 
    if(!contact) return (
        <div className="w-full h-screen bg-white">
            <div className="h-80 flex flex-col justify-center items-center">
            <EmptyList size='34' text='No Contact Found' />
            </div>
        </div>
    )

    return (
        <div className="w-full p-6 md:px-2 md:pb-20 md:h-screen overflow-auto no-scrollbar space-y-5 bg-white relative z-10">
            <div className="border bg-baseBg rounded-md w-full relative">
                <div className="flex flex-col text-center justify-center items-center p-3 py-5 w-full h-full">
                    <div className="h-16 w-16 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center text-2xl justify-center">
                    {
                    contact?.profileImg ? (
                        <Image
                          src={contact?.profileImg || ''}
                          alt=""
                          width={200}
                          height={200}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        `${contact?.firstName?.[0] ?? ''}${contact?.lastName?.[0] ?? ''}`.toUpperCase() || 'NA'
                      )}
                    </div>
                    <h6 className="font-medium pt-3 leading-4">{contact?.firstName + ' ' + contact?.lastName}</h6>
                    <small>{contact?.email}</small>
                    <small>Age: {contact?.age} years</small>

                    <div className="pt-4 flex justify-center items-center gap-2">
                        {
                            [
                                {link: `mailto:${contact?.email}`, icon: <Mail />},
                                {link: `tel:${contact?.phone }`, icon: <PhoneCall />},
                                {link: `https://api.whatsapp.com/send?phone=${contact?.whatsapp }&text=Hi, ${contact?.firstName + ' ' + contact?.lastName}`, icon: <Whatsapp size={24} />}
                            ].map(({link, icon}, idx) => (
                                <Link href={link} target='_blank' key={idx}
                                      className="bg-purple-100 rounded-full h-12 w-12 shrink-0 flex items-center justify-center">
                                    {icon}
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <EditContact />
            </div>

            <p className="text-center text-sm py-2"><span className='font-semibold'>Contact Added: </span>{contact?.created_at && format(new Date(contact?.created_at!), 'MMM dd yyyy, hh:mm a')} </p>

            <div className="  border rounded-md space-y-3">
                <div className="text-center w-full p-4 bg-baseBg border-b font-semibold   rounded-md">Links</div>

                <div className="px-3 space-y-3 pb-4 w-full">
                    { Array.isArray(contact?.links)  && contact?.links.length ? contact?.links?.map(({url,title}, idx) => (
                        <button
                        key={idx}
                        className="p-3 w-full px-2 border rounded-md flex flex-col items-center gap-0.5 justify-center"
                        >
                        <div className="flex justify-center items-center gap-2">
                            <small className="py-0.5 px-2 rounded-full border border-purple-500">
                            {title}
                            </small>
                            <CopyLinkButton link={url}>
                                <Copy size={16} className="shrink-0 text-purple-300" />
                            </CopyLinkButton>
                        </div>
                        <p className="w-full overflow-clip text-center text-sm">{url!}</p>
                        </button>
                    ))
                    :
                    <div className="py-4 text-center">
                        <p className="text-slate-500">No links added</p>
                    </div>
                
                }
                </div>
            </div>

            <ContactTags/>

             <DeleteContact/>
        </div>
    )
}

export default Articleone
