'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const TabSwitch = () => {
    const pathname = usePathname()
  return (
    <section className="fixed px-4 bottom-16 sm:bottom-12 w-full flex justify-center">
        <div className="border-2 border-purple-200 max-w-sm rounded-full  bg-purple-100/50 flex p-1 gap-1">
            {
                [
                    {
                        label:'Booking',
                        link:'/shop-front/booking'
                    },
                    {
                        label:'Profile',
                        link:'/shop-front/profile'
                    },
                    {
                        label:'Images',
                        link:'/shop-front/images'
                    },
                ].map(({label,link},idx)=>{
                    return (
                        <Link href={link} key={idx} 
                        className={`${pathname===link ? 'bg-basePrimary text-white' : ''} px-6 py-1.5 rounded-full hover:bg-white duration-300  `}
                        >
                            {label}
                        </Link>
                    )
                })
            }
        </div>
    </section>
  )
}

export default TabSwitch