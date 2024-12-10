'use client'
import { useAppointmentContext } from '@/context/AppointmentContext'
import Image from 'next/image'

const ContactName = () => {
    const {contact} = useAppointmentContext()
  if(contact){
  return (
    <div className="md:hidden flex w-full pb-2 gap-2 items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center justify-center">
                  {contact?.profileImg ? (
                    <Image
                      src={contact?.profileImg}
                      alt=""
                      width={200}
                      height={200}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    `${contact?.firstName?.[0] ?? ''}${contact?.lastName?.[0] ?? ''}`.toUpperCase() || 'NA'
                  )}
                </div>
        <div className='  capitalize  leading-tight'>
            <p className='text-sm  font-semibold'>{contact?.firstName + ' ' + contact?.lastName}</p>
            <small>{contact?.email}</small>
        </div >
    </div>
  )} else null
}

export default ContactName