'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import CustomInput from '../ui/CustomInput'
import { CustomSelect } from '@/components/shared/CustomSelect'
import { DatePicker } from '../ui/DatePicker'

interface GoalFormData {
    name: string;
    description: string;
    owner: string;
    startDate: Date | null;
    endDate: Date | null;
  }
  
  const initialFormData: GoalFormData = {
    name: '',
    description: '',
    owner: '',
    startDate: null,
    endDate: null,
  };

const GoalsForm = ({ goal }: { goal?: any }) => {
  const [formData, setFormData] = useState<GoalFormData>(goal || initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Owner options for the select dropdown
  const ownerOptions = [
    { value: 'owner1', label: 'Owner 1' },
    { value: 'owner2', label: 'Owner 2' },
  ]

  // Handle change for inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setFormData((prevData) => ({ ...prevData, [field]: date }));
  };

  const handleSelectChange = (value: string, field?:string) => {
    if(field)
        setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!formData.name) newErrors.name = 'Goal name is required.'
    if (!formData.description) newErrors.description = 'Description is required.'
    if (!formData.owner) newErrors.owner = 'Please select an owner.'
    if (!formData.startDate) newErrors.startDate = 'Start date is required.'
    if (!formData.endDate) newErrors.endDate = 'End date is required.'
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

  // Handle submit with simulated async API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 1000))
      alert('Goal submitted successfully!')
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="py-8 space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
      {/* Goal Name */}
      <CustomInput
        label="Goal Name"
        name="name"
        value={formData.name}
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
        value={formData.description}
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
        onChange={handleSelectChange}
      />
      {errors.owner && <small className="text-red-500">{errors.owner}</small>}

      <div className="flex flex-col sm:flex-row items-center w-full gap-3">
            {/* Start Date */}
            <DatePicker
                label="Start Date"
                name="startDate"
                value={formData.startDate!}
                onChange={(date) => handleDateChange(date!, 'startDate')}
                placeholder="Pick a start date"
                className='w- '
            />
            {errors.startDate && <small className="text-red-500">{errors.startDate}</small>}

            {/* End Date */}
            <DatePicker
                label="End Date"
                name="endDate"
                value={formData.endDate!}
                onChange={(date) => handleDateChange(date!,'endDate')}
                placeholder="Pick an end date"
                className='py- '
            />
            {errors.endDate && <small className="text-red-500">{errors.endDate}</small>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full h-12 bg-purple-600 text-white rounded-md disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Goal'}
      </button>
    </form>
  )
}

export default GoalsForm
