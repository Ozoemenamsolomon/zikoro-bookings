'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import React from 'react'

const DeleteMember = ({id}:{id:number}) => {
    const handleDelete = ( ) => {
        console.log(`Delete team member with ID: ${id}`)
        // Add delete logic here
      }
  return (
    <Button
    variant="ghost"
    size="icon"
    onClick={ handleDelete }
  >
    <Trash2 className="w-5 h-5 text-red-500" />
  </Button> 
  )
}

export default DeleteMember