'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import CustomInput from '../ui/CustomInput'
import { CustomSelect } from '@/components/shared/CustomSelect'
import useUserStore from '@/store/globalUserStore'
import { Goal } from '@/types/goal'
import AddKeyResult from './AddKeyResult'
import { useAppointmentContext } from '@/context/AppointmentContext'
import { GoalDatePicker } from './GoalDatePicker'
import { isBefore, startOfDay, startOfToday } from 'date-fns'
import { useGoalContext } from '@/context/GoalContext'


const GoalsForm = ({ goal,mode, children }: { goal?: Goal,mode?:string, children?:React.ReactNode }) => {
  const {goalData, setGoalData, errors, setErrors, teamMembers} = useGoalContext()
  const {contact} = useAppointmentContext()
  const {user} = useUserStore()

  const [isValidated, setIsValid] = useState<boolean>()

  useEffect(() => {
    const initialFormData: Goal = {
      organization: user?.id,
      createdBy: user?.id,
      goalName: '',
      description: '',
      goalOwner: null,
      goalOwnerName: '',
      startDate: null,
      endDate: null,
      progress: null,
      contactId: String(contact?.id!),
      // status: 'DRAFT',
  };
    if(goal){
      setGoalData({ ...initialFormData, ...goal, goalOwner:goal.goalOwner?.id, goalOwnerName: `${goal?.goalOwner?.userId?.firstName} ${goal?.goalOwner?.userId?.lastName}` });
    }else{
      setGoalData(initialFormData)
    }
  }, [user,goal])
  // console.log({goalData})
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGoalData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setGoalData((prevData) => ({ ...prevData, [field]: date }));
    setErrors(prev => ({ ...prev, [field]: '' }))
  };

  const handleSelectChange = (value: string) => {
    const selectedOption = teamMembers.find(option => option.value === String(value));
    console.log({value,selectedOption})
    if (!selectedOption) {
      return;
    }
  
    setGoalData(prevData => ({
      ...prevData,
      goalOwner: Number(selectedOption.value),
      goalOwnerName: selectedOption.label,
    }));

    setErrors((prev)=>{
      return {
        ...prev,
        goalOwner:'',
        goalName:'',
      }
    })
  };
  
  // Basic form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    // if (!goalData.goalName) newErrors.goalName = 'Goal name is required.'
    if (!goalData.goalOwner) newErrors.goalOwner = 'Please select an owner.'
    if (!goalData.startDate) newErrors.startDate = 'Start date is required.'
    if (!goalData.endDate) newErrors.endDate = 'End date is required.'
    if (goalData.startDate && goalData.endDate && new Date(goalData.startDate) > new Date(goalData.endDate)) {
      newErrors.endDate = 'End date must be after start date.';
    }

  // console.log({goalData, user})
    
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }
 
 
    const isDayDisabled = (day: Date) => {
      // Disable days before today
      const startOfDayToCheck = startOfDay(day);
      if (isBefore(startOfDayToCheck, startOfToday())) {
        return true
      }
       return false  
	  };

    const isEndDayDisabled = (day: Date) => {
      // Disable days before today
      const startOfDayToCheck = startOfDay(day);
      if (isBefore(startOfDayToCheck, startOfToday())) {
        return true
      }
      if (goalData?.startDate && isBefore(startOfDayToCheck, startOfDay(goalData.startDate!))) {
        return true
      }
       return false  
	  };


  const openModal = () => setIsValid((cur)=> !cur&&validateForm() ? true:false)

  return (
    <>
      <form className="py-8 border-b mb-4 space-y-4 max-w-lg mx-auto" >
      {/* Goal Name */}
      <CustomInput
        label="Goal Name"
        name="goalName"
        value={goalData.goalName!}
        error={errors.goalName}
        placeholder="Enter Goal name"
        isTextarea
        isRequired
        onChange={handleChange}
      />

      {/* Description */}
      <CustomInput
        label="Description"
        name="description"
        value={goalData.description!}
        error={errors.description}
        placeholder="Enter detailed description of the goal"
        isTextarea
        onChange={handleChange}
      />

      {/* Owner */}
      <CustomSelect
        label="Owner"
        name='goalOwner'
        placeholder="Select an owner"
        options={teamMembers}
        value={goalData.goalOwner ? String(goalData.goalOwner ) :'' }
        error={errors?.goalOwner!}
        onChange={handleSelectChange}
        isRequired
        noOptionsLabel='No options available. Kindly add team members from the settings menu.'
      />

        <div className="flex flex-col sm:flex-row   w-full gap-3">
          <GoalDatePicker
              label="Start Date"
              name="startDate"
              value={goalData.startDate!}
              onChange={(date) =>{ 
                handleDateChange(date!, 'startDate')
                setGoalData((prev)=>{
                  return {
                    ...prev,
                    endDate: '',
                  }
                })
              }}
              placeholder="Pick a start date"
              error={errors?.startDate!}
              isRequired
              isDayDisabled={isDayDisabled}
          />
          <GoalDatePicker
              label="End Date"
              name="endDate"
              value={goalData.endDate!}
              onChange={(date) => handleDateChange(date!,'endDate')}
              placeholder="Pick an end date"
              className='py- '
              error={errors?.endDate!}
              isRequired
              isDayDisabled={isEndDayDisabled}
          />
        </div>
      </form>

      {children}

      <AddKeyResult isOpen={isValidated!} openModal={openModal} mode={mode} />
    </>
  )
}

export default GoalsForm
