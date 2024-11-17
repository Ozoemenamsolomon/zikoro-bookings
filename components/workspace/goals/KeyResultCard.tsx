import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { Button } from '@/components/ui/button'
import { KeyResult } from '@/types/goal'
import { ChevronRight, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const KeyResultCard = ({keyResult}:{keyResult:KeyResult}) => {
  return (
        <div className="p-2 pb-5 space-y-2 rounded-md border bg-white relative">
            <div className="bg-baseBg text-center w-full border rounded-md p-2 py-20">
                metric
            </div>

            <div className="px-4">
                <h6 className="font-bold">{keyResult?.keyResultTitle}</h6>
                <p className="text-sm">{keyResult?.description}</p>
            </div>

            <PopoverMenu
            className='w-40 ' 
            align='end'
                trigerBtn={
                    <Button className='rounded-full h-5 w-5 text-white p-1 absolute right-3 top-3'><MoreVertical/></Button>
                }
            >
                <div className="bg-white shadow rounded-md  p-4 space-y-3 text-sm w-full text-gray-800">
                    <button type="button" className='hover:text-gray-950 duration-300 block'>Open key result</button>

                    <button type="button" className='hover:text-gray-950 duration-300  block'>Edit</button>

                    <div className=' '>
                        <button type="button" className='flex items-center gap-3 w-full justify-between hover:text-gray-950 duration-300 '>
                            <p>Swith View</p>
                            <ChevronRight size={16}/>
                        </button>
                    </div>

                    <button type="button" className=' text-red-600 duration-300'>Delete key result</button>
                </div>
            </PopoverMenu>
        </div>
  )
}

export default KeyResultCard