"use client"

import React, { Suspense } from 'react'
import Image from 'next/image'
// import ProcessPayment from './ProcessPayment'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { AppointmentLink } from '@/types/appointments'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Calender from './Calender'
// import ProcessPayment from './ProcessPayment'
import { urls } from '@/constants'
import BookingOff from './BookingOff'

const Booking =  ({appointmentLink, error}:{appointmentLink:AppointmentLink, error?:string}) => {
  const {bookingFormData,  isFormUp} = useAppointmentContext()
  const {refresh,  } = useRouter()
//   console.log(appointmentLink)
  return (
 
        <main className="bg-baseBg px-3 sm:px-6 xl:px-12">
            <article className='relative max-w-[100rem] mx-auto flex flex-col gap-8 sm:gap-2 min-h-screen justify-between py-8 md:py-4'>
                {
                    error ? 
                    <section className='z-50 fixed flex-col gap-4 inset-0 bg-slate-950/30 flex items-center text-center justify-center w-full'>
                            <p className='text-red-600'>{error}</p>
                            <button onClick={refresh} className='bg-basePrimary px-4 py-2 text-white rounded-md'>Refresh the page</button>
                    </section>
                    : null
                }

                <header className=' shrink-0'>
                    {
                        appointmentLink?.logo ?
                        <div className='h-14 w-36'>
                            <Image src={appointmentLink?.logo } alt='brand logo' width={120} height={85} className='h-full w-full object-contain' />
                        </div>
                        :
                        <div className=''>
                            <Image src='/zikoro-b.png' alt='brand logo' width={100} height={50} />
                        </div>
                    }
                </header>
                {
                    !appointmentLink.statusOn ?
                    <BookingOff/>
                    :
                    // isFormUp==='pay' ? 
                    // <ProcessPayment appointmentLink={appointmentLink}/>
                    // :
                    <section className="h-full w-full flex items-center justify-center">
                        
                        <section className="w-full max-w-7xl mx-auto grid lg:flex gap-6 lg:justify-center md:max-h-[30rem] 2xl:max-h-[33rem]">

                            <div className="bg-white shadow w-full lg:w-80 overflow-auto hide-scrollbar xl:w-96  flex-shrink-0 p-6 rounded-lg ">

                                <h4 className="text-lg font-semibold ">{appointmentLink?.appointmentName}</h4> 

                                <div className="pt-24  pb-8">
                                    <div className="flex gap-1 pb-2 w-full items-start">
                                        <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Duration</p>
                                        <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{appointmentLink?.duration ? appointmentLink?.duration + 'mins':''}</p>
                                    </div>
                                    <div className="flex gap-1 pb-2 w-full items-start">
                                        <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location Type</p>
                                        <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">{ appointmentLink?.loctionType}</p>
                                    </div>
                                    {appointmentLink?.loctionType === 'Virtual' ? null : <div className="flex gap-1 pb-2 w-full items-start">
                                        <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Location</p>
                                        <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5  line-clamp-6">{ appointmentLink?.locationDetails }</p>
                                    </div>}
                                    {
                                        appointmentLink?.amount || bookingFormData?.price ? 
                                        <div className="flex  gap-1 pb-2 w-full items-start">
                                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Price</p>
                                            <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex ">
                                                {bookingFormData?.currency ? bookingFormData?.currency : appointmentLink?.curency} {bookingFormData?.price ? bookingFormData?.price  : appointmentLink?.amount}
                                            </p>
                                        </div> 
                                        : null
                                    }
                                    <div className="flex  pb-2 w-full items-start">
                                        <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Max booking</p>
                                        <p className=" w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5 flex "> {appointmentLink?.maxBooking}</p>
                                    </div>
                                    {
                                        appointmentLink?.note || bookingFormData?.categoryNote ? 
                                        <div className="flex pb-2 w-full items-start">
                                            <p className="font-medium w-1/3 sm:w-1/5 md:w-1/8 lg:w-2/5 ">Desc</p>
                                            <div className="line-clamp-5 w-2/3 sm:w-4/5 md:w-7/8 lg:w-3/5">
                                                <p className="">{appointmentLink?.note}</p>
                                                {bookingFormData?.categoryNote&&<p className="font-medium">{bookingFormData?.categoryNote}</p>}
                                            </div>
                                        </div> : null
                                    }
                                </div>
                            </div>
                        
                            <Calender appointmentLink={appointmentLink}/>
                        </section>
                    </section>
                }

                <footer className='shrink-0 flex w-full gap-4 justify-center items-center '>
                {
                    appointmentLink?.zikoroBranding ? 
                        <>
                        <p className="">Create your bookings with</p>
                        <Link href={urls.root}>
                            <Image src={'/zikoro-b.png'} alt='zikoro booking' width={110} height={55} />
                        </Link>
                        </>
                    : null
                }
                </footer> 

            </article>
        </main>
  )
}

export default Booking