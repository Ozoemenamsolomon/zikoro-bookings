'use client'

import { Button } from '@/components/ui/button'
import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { useGoalContext } from '@/context/GoalContext'
import { PostRequest } from '@/utils/api'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const SaveGoalBtn = () => {
    const {push} = useRouter()
    const {contact} = useAppointmentContext()
    const {goalData} = useGoalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleSave = async () => {
            // setErrors({})
            // setSuccess('')
            // if (!validateForm()) return
    
            setIsSubmitting(true)
            try {
                const { data, error } = await PostRequest({url:'/api/goals/editGoal', body:{goalData}})
                if (error) {
                    // setErrors({general:error})
                } else {
                    // console.log(data)
                    toast.success('Goal was editted')
                    // setSuccess('Goal created successfully')
                    // revalidatePath(`${urls.contacts}/${contact?.email}/goals/details/${data.id}?id=${contact?.id}&name=${contact?.firstName}`)
                    push(`${urls.contacts}/${contact?.email}/goals/details/${data.id}?id=${contact?.id}&name=${contact?.firstName}`)
                }
            } catch (error) {
              console.error('Submission failed:', error)
            } finally {
              setIsSubmitting(false)
            }
    
    }
  return (
    <Button onClick={handleSave} type='button' className='block bg-basePrimary'>
        {isSubmitting ? 'Saving...':'Save'}
    </Button>
  )
}

export default SaveGoalBtn