'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import CustomInput from '../ui/CustomInput'
import { CustomSelect } from '@/components/shared/CustomSelect'
import { DatePicker } from '../ui/DatePicker'
import KeyResultForm from './KeyResultForm'
import { useGoalContext } from '@/context/GoalContext'


const GoalsForm = ({ goal }: { goal?: any }) => {
  const {goalData,keyResultData, setGoalData, isSubmitting, setIsSubmitting,} = useGoalContext()

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

  useEffect(() => {
    if(goal) setGoalData(goal)
  }, [])
  
  // Owner options for the select dropdown
  const ownerOptions = [
    { value: 'owner1', label: 'Owner 1' },
    { value: 'owner2', label: 'Owner 2' },
  ]

  // Handle change for inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGoalData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setGoalData((prevData) => ({ ...prevData, [field]: date }));
  };

  const handleSelectChange = (value: string, field?:string) => {
    if(field)
        setGoalData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!goalData.name) newErrors.name = 'Goal name is required.'
    if (!goalData.description) newErrors.description = 'Description is required.'
    if (!goalData.owner) newErrors.owner = 'Please select an owner.'
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
        name="name"
        value={goalData.name}
        error={errors.name}
        placeholder="Enter Goal name"
        isTextarea
        isRequired
        onChange={handleChange}
      />

      {/* Description */}
      <CustomInput
        label="Description"
        name="description"
        value={goalData.description}
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
