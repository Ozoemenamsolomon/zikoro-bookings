'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import CustomInput from '../ui/CustomInput'
import { CustomSelect } from '@/components/shared/CustomSelect'
import { DatePicker } from '../ui/DatePicker'
import KeyResultForm from './KeyResultForm'
import { useGoalContext } from '@/context/GoalContext'
import useUserStore from '@/store/globalUserStore'


const GoalsForm = ({ goal }: { goal?: any }) => {
  const {goalData,keyResultData, setGoalData, isSubmitting, setIsSubmitting,} = useGoalContext()
  const {user}=useUserStore()

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

  useEffect(() => {
    if(goal) setGoalData(goal)
  }, [])
  
  // Owner options for the select dropdown
  const ownerOptions = [
    { value: {
      id:user?.id, 
      name: `${user?.firstName} ${user?.lastName}`}, 
      label: `${user?.firstName} ${user?.lastName}` },
    { value: {
      id:122, name:'Ebuka Johnson'}, 
      label: 'Ebuka Johnson' },
    { value: {
      id:102, name:'Smart Udoka'}, 
      label: 'Smart Udoka' },
    { value: {
      id:87, name:'Bodu Joel'}, 
      label: 'Bodu Joel' },
  ]

  // Handle change for inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGoalData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setGoalData((prevData) => ({ ...prevData, [field]: date }));
  };

  const handleSelectChange = (value: {id:number,name:string}, field?:string) => {
    if(field)
        setGoalData((prevData) => ({ 
        ...prevData, goalOwner: value.id, goalOwnerName: value.name }));
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!goalData.goalName) newErrors.goalName = 'Goal name is required.'
    if (!goalData.description) newErrors.description = 'Description is required.'
    if (!goalData.goalOwner) newErrors.goalOwner = 'Please select an owner.'
    if (!goalData.startDate) newErrors.startDate = 'Start date is required.'
    if (!goalData.endDate) newErrors.endDate = 'End date is required.'
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

  return (
    <>
    <form className="py-8 space-y-4 max-w-lg mx-auto" >
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
        isRequired
        onChange={handleChange}
      />

      {/* Owner */}
      <CustomSelect
        label="Owner"
        placeholder="Select an owner"
        options={ownerOptions}
        value={goalData.goalOwnerName!}
        error={errors?.ownerOptions!}
        onChange={handleSelectChange}
      />

      <div className="flex flex-col sm:flex-row items-center w-full gap-3">
            {/* Start Date */}
            <DatePicker
                label="Start Date"
                name="startDate"
                value={goalData.startDate!}
                onChange={(date) => handleDateChange(date!, 'startDate')}
                placeholder="Pick a start date"
                error={errors?.startDate!}
                className='w- '
            />

            {/* End Date */}
            <DatePicker
                label="End Date"
                name="endDate"
                value={goalData.endDate!}
                onChange={(date) => handleDateChange(date!,'endDate')}
                placeholder="Pick an end date"
                className='py- '
                error={errors?.endDate!}
            />
      </div>
      </form>

      <div className="border-t w-full pt-4 flex flex-col items-center">
        <KeyResultForm  isActive={validateForm}/>
        <small>Define a method for measuring this goal</small>
      </div>
    </>
  )
}

export default GoalsForm
