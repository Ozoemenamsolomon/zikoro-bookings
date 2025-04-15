'use client'

import { FilterIcon, urls } from '@/constants'
import useUserStore from '@/store/globalUserStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CreateWorkSpace from './CreateWorkSpace'
import { Button } from '@/components/ui/button'
 
import { PlusCircle, RotateCw } from 'lucide-react'
import { fetchCurrencies } from '@/lib/server/workspace'
import { BookingsCurrencyConverter } from '@/types'

const WsComponent = () => {
    const { push } = useRouter()
    const { currentWorkSpace, workspaces } = useUserStore()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [currencies, setCurrencies] = useState<{label:string,value:string}[]>([])

    // Handle redirection
    useEffect(() => {
        const fetchData = async () => {
            const {data} = await fetchCurrencies()
            const options = data.map((item)=>({
                label:item.currency, value:String(item.amount)
              }))
              setCurrencies(options)
        }
        if (currentWorkSpace) {
            push(`/ws/${currentWorkSpace.organizationAlias}/schedule`)
        } else if (workspaces[0]) {
            push(`/ws/${workspaces[0].organizationAlias}/schedule`)
        }
        fetchData()
    }, [currentWorkSpace, workspaces,])

    // Handle Refresh with Loader Simulation
    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            window.location.reload()
        }, 1000) // Simulate 1-second loading delay
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
                    <CreateWorkSpace
                        currencies={currencies}
                        redirectTo='/schedule'
                        button={
                            <Button className="bg-basePrimary text-white flex items-center">
                                <PlusCircle className="shrink-0" />
                                Add a workspace
                            </Button>
                        }
                    />
                    <Button
                        onClick={handleRefresh}
                        className="bg-basePrimary text-white flex items-center"
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
