import { NoCalendarIcon, urls } from '@/constants'
import Link from 'next/link'
import React from 'react'
import { useAppointmentContext } from "@/context/AppointmentContext";


const Empty = ({
  placeholder='/calender.png',
  text='Your booked appointments will appear here. '}:{placeholder?:string,text?:string}) => {
    const {getWsUrl} = useAppointmentContext()
  return (
    <section className="w-full min-h-screen relative pt-40 ">
    {/* <div className='absolute top-0 w-full h-full overflow-hidden'>
      <Image src={placeholder} alt='calender' width={800} height={700} className='h-full w-full object-cover' />
    </div>  */}

    <div className="relative max-w-xl mx-auto p-6 flex flex-col text-center  items-center justify-center">
 
      <h2 className="text-2xl lg:text-4xl font-bold pb-12" 
      style={{
        background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
         {text} 
      </h2>
      <p className='pb-4 font-semibold'>Haven’t created a schedule?</p>

      <Link href={getWsUrl(urls.create)} className='py-3 px-6 font-semibold text-white rounded-md bg-basePrimary' >Start creating</Link>
    </div>
  </section>
  )
}

export default Empty