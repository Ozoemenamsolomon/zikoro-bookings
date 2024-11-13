'use client'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import React, {  useRef, useState } from 'react'
import Sidebar from './Sidebar'
import { useClickOutside } from '@/lib/useClickOutside'
import Image from 'next/image'
import Link from 'next/link'
import { urls } from '@/constants'
// import { NotifyIcon } from '@/constants'
// import Notification from './Notification'

const Main = ({children}:{children:React.ReactNode}) => {
    const [show, setShow] = useState<boolean>(false)
    const [drop, setDrop] = useState<boolean>(false)
    const sidebar = useRef(null)
    const ref = useRef(null)

    useClickOutside(sidebar,()=>setShow(false))

    useClickOutside(ref, ()=>setDrop(false))

  return (
        <main className="bg-baseBg min-h-screen">
            <aside ref={sidebar} className={`${show ? 'z-30 w-60':' w-0 -z-10'} transform transition-all duration-300 ease-in-out  border-r bg-white h-screen overflow-y-auto fixed top-0 left-0 lg:hidden no-scrollbar`}>
                <div className="absolute top-6 right-6 flex justify-end w-full">
                    <button type="button" onClick={()=>setShow(false)}><ChevronFirst size={18} className='text-gray-600'/></button>
                </div>
                <Sidebar/>
            </aside>

            <aside className={`max-lg:hidden z-30 flex-shrink-0 w-60 border-r bg-white h-screen overflow-auto no-scrollbar fixed top-0 left-0 `}>
                <Sidebar/>
            </aside>

            <article className="lg:pl-60 w-full  h-full">
                <div className="p-4 relative" >
                    <button className='lg:hidden absolute left-4 top-6' type="button" onClick={()=>setShow(true)}>
                        <ChevronLast size={18} className='text-gray-600'/>
                    </button>

                    <header className='flex justify-between w-full gap-4  items-center pb-2 '>
                        <div></div>

                        <Link href={urls.root}><Image src={'/zikoro.png'} alt={'zikro-icon'} height={180} width={100} className=''/></Link>

                        <div ref={ref} className="relative">
                            {/* <button onClick={()=>setDrop(curr=>!curr)} className="hover:shadow-sm duration-300 relative">
                                <NotifyIcon/>
                                <div className="bg-basePrimary rounded-full focus:outline-none h-6 absolute -right-1 top-0 w-6  flex justify-center items-center ring ring-white text-white text-[12px]">22</div>
                            </button >

                            <Notification drop={drop} setDrop={setDrop}/> */}
                        </div>
                    </header>
                    {children}
                </div>
            </article>
        </main>
  )
}

export default Main