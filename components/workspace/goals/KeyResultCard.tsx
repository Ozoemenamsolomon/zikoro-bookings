import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { Button } from '@/components/ui/button'
import { CirclePointer } from '@/constants'
import { Menu } from 'lucide-react'
import React from 'react'

const KeyResultCard = () => {
  return (
    <div className='space-y-4'>
        <div className="flex gap-2 items-center w-full">
            <div className="shrink-0">
                <CirclePointer/>
            </div>
            <div className="flex-1 min-w-0 truncate">
                <h5 className="font-bold text-lg">Key results</h5>
                <p className="text-sm">Targets and objectives assigned to this goal</p>
            </div>
        </div>
        <div className="p-2 space-y-2 rounded-md border bg-white relative">



            <div className="bg-baseBg border rounded-md p-2 h-44">

            </div>

            <h6 className="font-bold">
            Increase knee flexion: Achieve 90 degrees of knee flexion within 3 weeks, progressing to 110 degrees by 6 weeks.
            </h6>
            <p className="text-sm">Hipster ipsum tattooed brunch I'm baby. Ascot plaid unicorn axe jianbing pop-up selvage sold intelligentsia. Roof mumblecore sold fanny out Read more
            portland shabby vinyl ugh kogi. Praxis vinegar irony street cray goth. Lumbersexual truck book 8-bit selfies yuccie you small yuccie. Wolf pok try-hard xoxo sartorial. Celiac booth yes bun heard bag. </p>
        </div>

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
    </div>
  )
}

export default KeyResultCard