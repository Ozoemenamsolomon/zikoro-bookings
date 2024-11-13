import React from 'react'
import ProgressMetrics from './ProgressMetrics'
import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const GoalCard = () => {
  return (
    <div className='bg-white border rounded-md p-3 relative space-y-3'>
        <ProgressMetrics/>
        <PopoverMenu
        className='w-44' 
        align='end'
            trigerBtn={
                <Button className='rounded-full h-4 w-4 text-white p-1 absolute right-3 top-3'><Menu/></Button>
            }
        >
            <div className="bg-white shadow rounded-md  p-4 h-36">
                Drop down
            </div>
        </PopoverMenu>

        <h4 className="font-semibold">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti voluptates qui laudantium optio numquam tenetur nisi maiores? Autem, repellat maxime.</h4>
        <p className="text-sm   pb-4 border-b w-full">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti voluptates qui laudantium optio numquam tenetur nisi maiores? Autem, repellat maxime.</p>

        <div className="flex justify-between gap-x-2">
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
  )
}

export default GoalCard