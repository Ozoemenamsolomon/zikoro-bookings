'use client'

import { Button } from '@/components/ui/button'
import { handleDeleteTeamMember } from '@/lib/deleteFunctions'
import { BookingTeamsTable } from '@/types'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
 
interface DeleteMemberProps {
  id: number
  setTeams: React.Dispatch<React.SetStateAction< BookingTeamsTable[]>>
}

const DeleteMember: React.FC<DeleteMemberProps> = ({ id, setTeams }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await handleDeleteTeamMember(id)
      setTeams((prev) => prev.filter((member) => member.id !== id))
    } catch (error) {
      console.error('Failed to delete team member:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className={`w-5 h-5 ${isDeleting ? 'text-gray-400 animate-pulse' : 'text-red-500'}`} />
    </Button>
  )
}

export default DeleteMember
