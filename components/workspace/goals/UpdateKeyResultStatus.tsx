'use client'
import { CenterModal } from '@/components/shared/CenterModal'
import { keyresultStatus } from '@/constants/status'
import { KeyResult } from '@/types/goal'
import { PostRequest } from '@/utils/api'
import { Edit, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type UpdateKeyResultStatusProps = {
  keyResult: KeyResult
}

const UpdateKeyResultStatus = ({ keyResult }: UpdateKeyResultStatusProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string>(keyResult?.status || '')
  const [isDeletable, setIsDeletable] = useState(true) 
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { refresh } = useRouter()

  useEffect(() => {
    if (keyResult?.status) {
      setStatus(keyResult.status)
    }
  }, [keyResult?.status])

  const handleUpdate = async (selectedStatus: string) => {
    try {
      setIsSubmitting(true)
      const { error } = await PostRequest({
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
        setStatus(selectedStatus)
        refresh()
        toast.success('Status update was successful')
        setIsModalOpen(false) 
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="shrink-0">
      <CenterModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        disabled={!isDeletable} // Disable trigger based on the condition
        className="max-w-80"
        trigerBtn={
          <button className="underline flex items-center gap-1 flex-nowrap text-zikoroBlue whitespace-nowrap">{keyResult?.status}<Edit size={20} className='text-gray-700'/></button>
        }
      >
        <div className="p-6">
          <h6 className="text-lg font-bold text-center pb-6">Update Status</h6>
          <p className="pb-4 text-center">
            Status:{' '}
            <span className="text-zikoroBlue">
              {isSubmitting ? 'Submitting...' : status}
            </span>
          </p>
          <div className="space-y-2">{
                keyresultStatus.map((statusOption, index) => (
                    <button
                    key={index}
                    onClick={() => handleUpdate(statusOption)}
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
      </CenterModal>
    </div>
  )
}

export default UpdateKeyResultStatus
