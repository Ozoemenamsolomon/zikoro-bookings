import { CenterModal } from '@/components/shared/CenterModal'
import { Button } from '@/components/ui/button'
import { KeyResultsTimeline } from '@/types/goal'
import { SquareArrowOutUpRight } from 'lucide-react'
import React from 'react'
import { renderAttachment } from './MetricList'
import { format } from 'date-fns'
import { P } from 'styled-icons/fa-solid'

const MetricPreview = ({
    triggerBtn=<div className="flex justify-center">
                  <Button variant={'outline'} className="text-gray-700 p-1 px-2"><SquareArrowOutUpRight size={16}/></Button>
                </div>, 
    metric }: { 
      triggerBtn?: React.ReactNode,
      metric: KeyResultsTimeline
     }) => {
  return (
     <CenterModal
          className="max-w-2xl w-full overflow-hidden"
          trigerBtn={triggerBtn}
        >
    <div className='py-12 px-4 sm:px-8 space-y-6 overflow-auto hide-scrollbar max-h-screen'>

        <div className="border-b pb-2 w-full flex justify-between gap-2 text-sm">
            <p className="">{format(new Date(metric?.created_at!), 'MMM dd yyyy, hh:mm b')}</p>
            <p className="">{metric.createdBy}</p>
        </div>

        <h4 className="text-xl text-center mx-auto px-2 border-b border-gray-800 font-bold w-40"><span>Value: </span> {metric?.value}</h4>

        <div className="">
            <h6 className="leading- pb-2 font-bold">Notes </h6>
            {metric?.Note?.length! > 0 ?<div
                dangerouslySetInnerHTML={{ __html: metric?.Note! }}
                className="prose  text-xs border rounded-lg   p-4"
              />: 
            <p className='text-center py-4'>No note was added</p>}
        </div>

        <div className="">
            <h6 className="leading-tight pb-2  font-bold ">Attached files</h6>
            {metric?.attachments?.length! > 0 ? <div className="grid grid-cols-3 justify-center items-center md:grid-cols-4 lg:grid-cols-6 gap-2">
                {metric?.attachments?.map((preview, index) => (
                <div key={index} className="relative flex items-center justify-center border size-24 rounded-lg shadow-sm overflow-hidden">
                    {renderAttachment(preview?.url, preview?.type)}
                </div>
                ))}
            </div> : 
            <p className='text-center py-4'>No file attached</p>}
        </div>
    </div>
    </CenterModal>
  )
}

export default MetricPreview