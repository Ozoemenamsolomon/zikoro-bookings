'use client'

import { Button } from '@/components/ui/button'
import { urls } from '@/constants'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { useGoalContext } from '@/context/GoalContext'
import { PostRequest } from '@/utils/api'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const SaveGoalBtn = ({mode}:{mode?:string}) => {
    const {push} = useRouter()
    const {contact,getWsUrl} = useAppointmentContext()
    const {goalData, setGoalData, keyResultData, setKeyResultData, errors, setErrors} = useGoalContext()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = () => {
      const newErrors: { [key: string]: string | null } = {}
      if (!goalData.goalName) newErrors.goalName = 'Goal name is required.'
      if (!goalData.goalOwner) newErrors.goalOwner = 'Please select an owner.'
      if (!goalData.startDate) newErrors.startDate = 'Start date is required.'
      if (!goalData.endDate) newErrors.endDate = 'End date is required.'
      if (goalData.startDate && goalData.endDate && new Date(goalData.startDate) > new Date(goalData.endDate)) {
        newErrors.endDate = 'End date must be after start date.';
      }

      setErrors(newErrors)
      return Object.values(newErrors).every(error => !error)
    }

    const handleSave = async () => {
            setErrors({})
            // setSuccess('')
            if (!validateForm()) return
    
            setIsSubmitting(true)
            try {
              if(mode==='create'){
                const { data, error } = await PostRequest({url:'/api/goals/create', 
                  body:{
                  goalData, keyResultData,
                }})
                if (error) {
                    setErrors({general:error})
                    toast.error('An error occurred. ')
                } else {
                    // console.log(data)
                    toast.success('You created a new gaol')
                    setGoalData({})
                    setKeyResultData({})
                    // setSuccess('Goal created successfully')
                    // revalidatePath(`${urls.contacts}/${contact?.id}/goals/details/${data.id}`)
                    push(getWsUrl(`${urls.contacts}/${contact?.id}/goals/details/${data.id}`))
                }
              } else {
                const { data, error } = await PostRequest({url:'/api/goals/editGoal', body:{goalData}})
                if (error) {
                    setErrors({general:error})
                } else {
                    // console.log(data)
                    toast.success('Goal was editted')
                    setGoalData({})
                    setKeyResultData({})
                    // setSuccess('Goal created successfully')
                    // revalidatePath(`${urls.contacts}/${contact?.id}/goals/details/${data.id}`)
                    push(getWsUrl(`${urls.contacts}/${contact?.id}/goals/details/${data.id}`))
                }
              }

            } catch (error) {
              console.error('Submission failed:', error)
            } finally {
              setIsSubmitting(false)
            }
    
    }
  return (
    <Button disabled={isSubmitting} onClick={handleSave} type='button' className='block bg-basePrimary'>
        {isSubmitting ? 'Saving...':'Save'}
    </Button>
  )
}

export default SaveGoalBtn