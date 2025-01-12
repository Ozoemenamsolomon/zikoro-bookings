'use client'
import { CenterModal } from '@/components/shared/CenterModal'
import { DropMenu } from '@/components/shared/DropMenu'
import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { keyresultStatus } from '@/constants/status'
import { KeyResult } from '@/types/goal'
import { PostRequest } from '@/utils/api'
import { Edit, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type UpdateKeyResultStatusProps = {
  keyResult: KeyResult
  label?:string
  status:string, setStatus:(status:string)=>void
}

const UpdateKeyResultStatusTimeline = ({
   keyResult , label,
   status, setStatus,
}: UpdateKeyResultStatusProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { refresh } = useRouter()

  useEffect(() => {
    if (keyResult?.status) {
      setStatus(keyResult.status)
    }
  }, [keyResult?.status])

  return (
    <div className="shrink-0">
      <PopoverMenu
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        className="max-w-80"
        trigerBtn={
          label ?
          <button className=" flex items-center gap-1 flex-nowrap  whitespace-nowrap">{label}  </button> : 
          <button className="border border-gray-300 p-2 rounded-md  flex items-center gap-2 flex-nowrap text-  whitespace-nowrap">
            Update status: 
            <span className='text-blue-500 text-sm'>{status?status:keyResult?.status}</span>
            <span className="text-sm italic text-gray-500">(optional)</span>
            {/* Update <Edit size={20} className='text-gray-700'/> */}
            </button>
        }
      >
        <div className="p-6">
          <h6 className="text-lg font-bold text-center pb-6">Update Status</h6>
          <p className="pb-4 text-center">
            Status: <span className="text-zikoroBlue">
              { status}
            </span>
          </p>
          <div className="space-y-2">{
                keyresultStatus.map((statusOption, index) => (
                    <button
                    key={index}
                    onClick={() => setStatus(statusOption)}
                    className={`w-full py-2 border rounded-md duration-300 ${
                        status === statusOption ? 'border-purple-300' : 'hover:bg-purple-50 hover:border-purple-200'
                    }`}
                    >
                    {statusOption}
                    </button>
                ))
            }
          </div>
        </div>
      </PopoverMenu>
    </div>
  )
}

export default UpdateKeyResultStatusTimeline

export  const handleUpdate = async (selectedStatus: string, keyResult:KeyResult) => {
  try {
     
    const {data, error } = await PostRequest({
      url: '/api/goals/editKeyResult',
      body: {
        keyResultData: {
          status: selectedStatus,
          id: keyResult.id,
        },
      },
    })

    if (error) {
      toast.error('Status update was unsuccessful')
    } else {
      return data
    }
  } catch (error) {
    console.error('Error updating status:', error)
    toast.error('Something went wrong. Please try again.')
  }  
}