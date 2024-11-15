import { CenterModal } from '@/components/shared/CenterModal'
import React, { useCallback, useState } from 'react'
import CustomInput from '../ui/CustomInput'
import { KeyResultsType, useGoalContext } from '@/context/GoalContext'
import { CustomSelect } from '@/components/shared/CustomSelect'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '@/components/ui/button'
import ValueMetrics from './ValueMetrics'
import { LikeIcon, ListView, OneTwoThree } from '@/constants'

const KeyResultForm = ({isActive}:{isActive:()=>void}) => {
  const {keyResultData, setKeyResultData, isSubmitting, setIsSubmitting,} = useGoalContext()

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  
  // Owner options for the select dropdown
  const ownerOptions = [
    { value: 'owner1', label: 'Owner 1' },
    { value: 'owner2', label: 'Owner 2' },
  ]

  // Handle change for inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setKeyResultData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setKeyResultData((prevData) => ({ ...prevData, [field]: date }));
  };

  const handleSelectChange = (value: string, field?:string) => {
    if(field)
        setKeyResultData((prevData) => ({ ...prevData, [field]: value }));
  };

   // Basic form validation
   const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!keyResultData.name) newErrors.name = 'Goal name is required.'
    if (!keyResultData.description) newErrors.description = 'Description is required.'
    if (!keyResultData.owner) newErrors.owner = 'Please select an owner.'
    if (!keyResultData.startDate) newErrors.startDate = 'Start date is required.'
    if (!keyResultData.endDate) newErrors.endDate = 'End date is required.'
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

    // Handle submit with simulated async API call
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // setErrors({})
        // if (!validateForm()) return
        validateForm()
        setIsSubmitting(true)
        try {
          // Simulate API call
          await new Promise(res => setTimeout(res, 1000))
          console.log('Goal submitted successfully!', errors, keyResultData)
        } catch (error) {
          console.error('Submission failed:', error)
        } finally {
          setIsSubmitting(false)
        }
      }
    
  return (
    <CenterModal
        className='rounded-md bg-white max-w-2xl w-full px-4 py-8 overflow-auto sm:max-h-[95vh] hide-scrollbar'
        trigerBtn={
            <button
                type="submit"
                // disabled={!isActive()}
                className="text-basePrimary underline px-4"
                > Add Key Result
            </button>
        }
    >
        <section className="">
            <div className="border-b pb-3 w-full">
                <h4 className="text-lg font-bold">New Key Result</h4>
                <p className="pt-3 font-semibold">Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat iure dolorem adipisci saepe molestias.</p>
            </div>


            <form className="pt-8 space-y-3 max-w-lg mx-auto" onSubmit={handleSubmit} >
            <CustomInput
                label="Goal Name"
                name="name"
                value={keyResultData.name}
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
                value={keyResultData.description}
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
                        value={keyResultData.startDate!}
                        onChange={(date) => handleDateChange(date!, 'startDate')}
                        placeholder="Pick a start date"
                        error={errors?.startDate!}
                        className='w- '
                    />

                    {/* End Date */}
                    <DatePicker
                        label="End Date"
                        name="endDate"
                        value={keyResultData.endDate!}
                        onChange={(date) => handleDateChange(date!,'endDate')}
                        placeholder="Pick an end date"
                        className='py- '
                        error={errors?.endDate!}
                    />
            </div>

            <div className="">
                <p className="pb-2">How do you want to track this progress</p>
                <div className="flex gap-4 flex-wrap w-full">
                    {
                        metricsTypes.map(({icon,label,type})=>{
                            return (
                                <div key={type} 
                                onClick={()=>setKeyResultData(
                                    (prev)=>{
                                    return {
                                        ...prev,
                                        metricType: type
                                    }
                                })}
                                className={`
                                ${keyResultData.metricType===type ? 'border-purple-300 border-2':''} w-24 h-24 flex flex-col rounded-md items-center justify-center border hover:shadow duration-300 text-sm`}>
                                    {icon}
                                    {label}
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>

            {
                keyResultData.metricType==='value' &&
                <ValueMetrics/>
            }

            <div className=" w-full pt-4 flex flex-col items-center">
                <Button type='submit' className='bg-basePrimary'>
                    Save
                </Button>
            </div>
            </form>
        </section>
    </CenterModal>
  )
}

export default KeyResultForm


const metricsTypes:{
        icon: React.ReactNode,
        type: 'value' | 'milestone' | 'boolean',
        label: string,
}[] = [
    {
        icon: <OneTwoThree/>,
        type: 'value',
        label: 'Value',
    },
    {
        icon: <ListView/>,
        type: 'milestone',
        label: 'Milestone',
    },{
        icon: <LikeIcon/>,
        type: 'boolean',
        label: 'Yes/No',
    },
]