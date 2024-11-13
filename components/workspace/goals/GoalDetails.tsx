import { urls } from '@/constants'
import { ArrowLeft, PenLine } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProgressMetrics from './ProgressMetrics'
import { format } from 'date-fns'
import KeyResultCard from './KeyResultCard'

const GoalDetails = () => {
  return (
    <section className='bg-white sm:p-3 '>
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <Link href={urls.contactsGoals} className='bg-white border flex justify-center items-center h-8 w-8 rounded-full'>
                  <ArrowLeft size={18}/>
                </Link >
                <h3 className="font-bold text-xl">Goal</h3>
                <button type="button" className='flex gap-1 items-center text-sm'>
                  <PenLine size={16}/>
                  Edit
                </button>
            </header>

            <div className="space-y-3">
                <ProgressMetrics/>
                <h4 className="font-semibold">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti voluptates qui laudantium optio numquam tenetur nisi maiores? Autem, repellat maxime.</h4>
                <p className="text-sm   pb-4 border-b w-full">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti voluptates qui laudantium optio numquam tenetur nisi maiores? Autem, repellat maxime.</p>
                <div className="flex  justify-between gap-x-2">
                    <div className="flex-1 min-w-0 truncate flex gap-2 items-center">
                        <div className="rounded-full h-10 w-10 flex justify-center items-center font-bold bg-baseLight">
                            IA
                        </div>
                        <small className='truncated text-[12px]'>Emmanuel Udeji</small>
                    </div>

                    <div className="space-y-1 text-[12px]">
                        <div className="flex justify-end gap-1 items-center">
                            <p>Start Date:</p>
                            <p className='font-semibold'>{format(new Date(), 'dd/MM/yyyy')}</p>
                        </div>
                        <div className="flex justify-end gap-1 items-center">
                            <p>End Date:</p>
                            <p className='font-semibold'>{format(new Date(), 'dd/MM/yyyy')}</p>
                        </div>
                    </div>


                </div>
            </div>

            <KeyResultCard/>
        </section>
    </section>
  )
}

export default GoalDetails