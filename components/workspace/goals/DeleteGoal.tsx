'use client'

import { useState } from "react"
import { CenterModal } from "@/components/shared/CenterModal"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Goal, KeyResult } from "@/types/goal"
import { useRouter } from "next/navigation"
import { PostRequest } from "@/utils/api"

const DeleteGoal = ({goal}:{goal:Goal}) => {
  const {refresh} = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletable, setIsDeletable] = useState(true) 
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleDelete = async () => {
    try {
      setIsSubmitting(true)
      const { error } = await PostRequest({
        url: '/api/goals/editGoal',
        body: {
          goalData: {
            status: 'Archived',
            id: goal.id,
          },
        },
      });

      if (error) {
        toast.error('Goal update was unsuccessful');
      } else {
        refresh();
        toast.success('Goal deleted');
        setIsModalOpen(false) 
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <CenterModal
      className="max-w-sm"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        disabled={!isDeletable} // Disable trigger based on the condition
        trigerBtn={<button className="text-red-600">Delete Goal</button>}
      >
        <div className="p-6">
          <h6 className="text-lg font-bold text-center pb-6">Confirm Delete</h6>
          <p className="text-center pb-4">
            Are you sure you want to delete this goal? This action cannot
            be undone.
          </p>
          <div className=" flex gap-2">
            <Button
            variant={'destructive'}
              onClick={handleDelete}
              className="w-full   py-3 px-4 flex gap-2 justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              Delete
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 px-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  )
}

export default DeleteGoal
