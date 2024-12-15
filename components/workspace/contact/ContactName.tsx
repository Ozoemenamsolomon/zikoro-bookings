'use client'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { ArrowLeft } from 'lucide-react'

const ContactName = () => {
    const {contact, setIsOpen, isOpen} = useAppointmentContext()
  return (
    <div className="flex  md:text-lg w-full gap-2 items-center pb-4">
      <div onClick={()=>setIsOpen(false)} className={` ${isOpen ? 'max-md:text-zikoroBlue': ''} flex gap-2 items-center `}>
        <ArrowLeft size={16} className={!isOpen ?` hidden`: 'md:hidden '} />
        <h4 className={` font-semibold `}>Contacts</h4>
      </div>
      <p className={isOpen?'min-w-0 truncate font-semibold md:hidden':'hidden '}> / {contact?.firstName + ' ' + contact?.lastName}</p>
        {/* <div className="h-12 w-12 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center justify-center">
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
        </div > */}
    </div>
  )
}

export default ContactName