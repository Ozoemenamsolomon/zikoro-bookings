'use client'

import { CenterModal } from '@/components/shared/CenterModal'
import { Button } from '@/components/ui/button'
import { handleDeleteTeamMember } from '@/lib/deleteFunctions'
import { BookingTeamsTable } from '@/types'
import { PostRequest } from '@/utils/api'
import { Loader2, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
 
interface DeleteMemberProps {
  id: number
  setTeams: React.Dispatch<React.SetStateAction< BookingTeamsTable[]>>
}

const DeleteMember: React.FC<DeleteMemberProps> = ({ id, setTeams }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
       const {error,data,} = await PostRequest({
        url:'/api/workspaces/team/deleteMember', 
        body:{id,status:'ARCHIVED'}})

        if(!error){
          setTeams((prev) => prev.filter((member) => member.id !== id))
        } else {
          toast.error('Item could not delete. Check your network')
        }
    } catch (error) {
      console.error('Failed to delete team member:', error)
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <CenterModal
      className='max-w-md px-6 py-8'
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigerBtn={
        <Button
        variant="ghost"
        size="icon"
        disabled={isDeleting}
      >
        <Trash2 className={`w-5 h-5 ${isDeleting ? 'text-gray-400 animate-pulse' : 'text-red-500'}`} />
      </Button>
    }>
      <div className=" text-center flex flex-col items-center  ">
        <p className="pb-6">You are about to remove a member</p>
        
        <Button
        className='w-full mb-2'
        variant={'destructive'}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {!isDeleting?<Trash2 className={'text-white'} />:<Loader2 className='animate-spin'/>}
        Remove
      </Button>

      <Button
        onClick={()=>setIsOpen(false)}
        className='w-full'
        disabled={isDeleting}
      >
        <X className={'text-white'} />
        Cancel
      </Button>
      </div>
    </CenterModal>
    
  )
}

export default DeleteMember
