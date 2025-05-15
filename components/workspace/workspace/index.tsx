'use client'

import { urls } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, {useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
 
import { PlusCircle, RotateCw } from 'lucide-react'
import { useAppointmentContext } from '@/context/AppointmentContext'
import CreateWorkSpace from './CreateWorkSpace'
import { User } from '@/types/appointments'
import useUserStore from '@/store/globalUserStore'
 

const WsComponent = ({user}:{user:User}) => {
    const { setIsOpen,isOpen} = useAppointmentContext()
    const {setUser} = useUserStore()
    const { push, refresh } = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Handle Refresh with Loader Simulation
    const handleRefresh = () => {
        // setIsRefreshing(true)
            window.location.reload()
    }

    useEffect(() => {
    setUser(user)
    }, [ ])

    if(isOpen) {
        return ( 
            <main className="min-h-screen w-full flex justify-center max-w-4xl items-center mx-auto  ">
                <CreateWorkSpace/> 
            </main>
    )
    }

    return (
        <section className="min-h-screen flex flex-col justify-between py-8 items-center font-semibold text-center">
            <Link href={urls.root}>
                <Image
                    src={'/zikoro.png'}
                    alt={'zikro-icon'}
                    height={180}
                    width={100}
                />
            </Link>

            <div className="text-center space-y-4">
                <h1 className="font-bold text-4xl sm:text-6xl">OoopS!</h1>
                <h1 className="font-bold text-4xl sm:text-6xl">No workspace found!</h1>
                <div className="flex max-w-80 mx-auto justify-center gap-3 items-center">
                    <Button
                        onClick={()=>setIsOpen(true)}
                        type="button"
                        className="bg-basePrimary text-white w-full flex gap-2 items-center "
                    >
                        <PlusCircle size={16} />
                        <p className="text-sm">Create Workspace</p>
                    </Button>
                    <Button
                        onClick={handleRefresh}
                        className="bg-baseLight text-  flex items-center"
                        disabled={isRefreshing}
                    >
                        <RotateCw className={isRefreshing ? 'animate-spin':''}/>
                        <span> Refresh</span>
                    </Button>
                </div>
            </div>

            <div>
                Powered by{' '}
                <Link href="https://www.zikoro.com">Zikoro.com</Link> ©{' '}
                {new Date().getFullYear()}
            </div>
        </section>
    )
}

export default WsComponent
