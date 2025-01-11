'use client'
import React, { useRef, useState } from 'react'
import { ChevronRight, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { useClickOutside } from '@/lib'
import Link from 'next/link'
import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { useParams } from 'next/navigation'
import EditKeyResultDetails from './EditKeyResultDetails'
import { KeyResult } from '@/types/goal'
import DeleteKeyResult from './DeleteKeyResult'
import UpdateKeyResultStatus from './UpdateKeyResultStatus'

const DropDownKeyResultAction = ({keyResult}:{keyResult:KeyResult}) => {
  const [selectedView, setSelectedView] = useState<'Default' | 'Chart'>('Default');
  const [drop, setDrop] = useState<boolean>(false);
  const ref = useRef(null)
  useClickOutside( ref, ()=>setDrop(false))
  const {contact,getWsUrl} = useAppointmentContext()

  const params = useParams()
  // console.log(params)
  return (
    <PopoverMenu
        className="w-48"
        align="end"
        trigerBtn={
          <Button className="rounded-full h-5 w-5 text-white p-1 absolute right-3 top-3">
            <MoreVertical />
          </Button>
        }
      >
        <div className="bg-white shadow rounded-md p-4 space-y-3 text-sm w-full text-gray-800">
          
          <Link href={getWsUrl(`${urls.contacts}/${contact?.id}/goals/details/${params?.goalId}/${keyResult.id}`)} 
          type="button" className="hover:text-gray-950 duration-300 block">
            Open key result
          </Link>

          <EditKeyResultDetails keyResult={keyResult!} text={'Edit details'}/>
          <UpdateKeyResultStatus keyResult={keyResult} label='Update Status'/>

          <div ref={ref}>
            <button
                onClick={()=>setDrop(prev=>!prev)}
              type="button"
              className="flex items-center gap-3 w-full justify-between hover:text-gray-950 duration-300"
            >
              <p>Switch View</p>
              <ChevronRight size={16} className={` ${drop ? 'rotate-90' : 'rotate-0'} transition-all duration-300 `}/>
            </button>
            <div className={`pl-2 space-y-2 ${drop ? 'max-h-96' : 'max-h-0 '} overflow-hidden transition-all duration-300`}>
              <label className="flex items-center gap-2 pt-2">
                <input
                  type="radio"
                  name="view"
                  value="Default"
                  checked={selectedView === 'Default'}
                  onChange={() => setSelectedView('Default')}
                  className="form-radio h-4 w-4 text-blue-500"
                />
                <span className="hover:text-gray-950 duration-300">Default</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="view"
                  value="Chart"
                  checked={selectedView === 'Chart'}
                  onChange={() => setSelectedView('Chart')}
                  className="form-radio h-4 w-4 text-blue-500"
                />
                <span className="hover:text-gray-950 duration-300">Chart</span>
              </label>
            </div>
          </div>

          <DeleteKeyResult keyResult={keyResult} />
        </div>
      </PopoverMenu>
  )
}

export default DropDownKeyResultAction