'use client'

import { CenterModal } from '@/components/shared/CenterModal'
import React, { useCallback, useEffect, useState } from 'react'
import CustomInput from '../ui/CustomInput'
import {  useGoalContext } from '@/context/GoalContext'
import { CustomSelect } from '@/components/shared/CustomSelect'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '@/components/ui/button'
import ValueMetrics from './ValueMetrics'
import { LikeIcon, ListView, OneTwoThree, urls } from '@/constants'
import { PostRequest } from '@/utils/api'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAppointmentContext } from '@/context/AppointmentContext'
import useUserStore from '@/store/globalUserStore'
import { revalidatePath } from 'next/cache'
import { Goal } from '@/types/goal'
import { GoalDatePicker } from './GoalDatePicker'
import { isAfter, isBefore, startOfDay, startOfToday } from 'date-fns'

const KeyResultForm = ({goal, isActive, mode}:{goal?: Goal, isActive?:boolean, mode?:string}) => {
  const {push,refresh} = useRouter()
  const {user} = useUserStore()
  const {contact} =useAppointmentContext()
  const {keyResultData, setKeyResultData, goalData, setGoalData, isSubmitting, setIsSubmitting,} = useGoalContext()

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    if(goal) setGoalData(goal)
  }, [goal])
  
  const ownerOptions = [
    { value:user?.id,  
      label: `${user?.firstName} ${user?.lastName}` },
    { value: 122,  
      label: 'Ebuka Johnson' },
    { value:102,
      label: 'Smart Udoka' },
    { value:87, 
      label: 'Bodu Joel' },
  ]

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setKeyResultData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setKeyResultData((prevData) => ({ ...prevData, [field]: date }));
    setErrors(prev => ({ ...prev, [field]: '' }))
  };

  const handleSelectChange = (value: number) => {
    const selectedOption = ownerOptions.find(option => option.value === Number(value));
    if (!selectedOption) {
      return;
    }
        setKeyResultData((prevData) => ({ ...prevData, keyResultOwner: Number(selectedOption?.value!) }));
  };

   const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!keyResultData.keyResultTitle) newErrors.keyResultTitle = 'Key result title is required.'
    // if (!keyResultData.description) newErrors.description = 'Description is required.'
    // if (!keyResultData.keyResultOwner) newErrors.keyResultOwner = 'Please select an owner.'
    if (!keyResultData.startDate) newErrors.startDate = 'Start date is required.'
    if (!keyResultData.endDate) newErrors.endDate = 'End date is required.'
    if (!keyResultData.unit) newErrors.unit = 'The Unit of measurement is required.'
    if (!keyResultData.targetValue) newErrors.targetValue = 'Target value is required.'
    if (!keyResultData.currentValue) newErrors.currentValue = 'Start value is required.'
    if (keyResultData.startDate && keyResultData.endDate && new Date(keyResultData.startDate) > new Date(keyResultData.endDate)) {
        newErrors.endDate = 'End date must be after start date.';
      }
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setSuccess('')
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            if(mode==='edit'){
                const { data, error } = await PostRequest({url:'/api/goals/createKeyResult', 
                    body:{ 
                        keyResultData:{
                            ...keyResultData,
                            goalId:goalData.id,
                            organization: goalData.organization,
                            createdBy: goalData.createdBy,
                        },
                    }
                })
                if (error) {
                    setErrors({general:error})
                } else {
                    // console.log(data)
                    toast.success('New key result added')
                    // setSuccess('New key result added')
                    setKeyResultData({})
                    setGoalData({})
                    refresh()
                }
            } else {
                const { data, error } = await PostRequest({url:'/api/goals/create', 
                    body:{ 
                        goalData:{...goalData, contactId:contact?.id},
                        keyResultData:{
                            ...keyResultData,
                            organization: goalData.organization,
                            createdBy: goalData.createdBy,
                            contactId: contact?.id,
                        },
                    }
                })
                if (error) {
                    setErrors({general:error})
                } else {
                    toast.success('Goal created')
                    setSuccess('Goal created successfully')
                    setKeyResultData({})
                    setGoalData({})
                    push(`${urls.contacts}/${contact?.id}/goals/details/${data.id}`)
                }
            }
        } catch (error) {
          console.error('Submission failed:', error)
        } finally {
          setIsSubmitting(false)
        }
      }

      const isStartDayDisabled = (day: Date) => {
        // Disable days before today
        const startOfDayToCheck = startOfDay(day);
        if (isBefore(startOfDayToCheck, startOfToday())) {
          return true
        }
        if (goalData?.startDate && 
            isBefore(startOfDayToCheck, startOfDay(goalData.startDate!))) {
            return true
          }
          if (goalData?.endDate && 
            isAfter(startOfDayToCheck, startOfDay(goalData.endDate!))) {
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
        if (goalData?.startDate && 
            isBefore(startOfDayToCheck, startOfDay(goalData.startDate!))) {
            return true
          }
          if (goalData?.endDate && 
            isAfter(startOfDayToCheck, startOfDay(goalData.endDate!))) {
            return true
          }
          if (keyResultData?.startDate && 
            isBefore(startOfDayToCheck, startOfDay(keyResultData.startDate!))) {
            return true
          }
         return false  
        };

  return (
    <CenterModal
        className='rounded-md bg-white max-w-2xl w-full px-4 py-8 overflow-auto sm:max-h-[95vh] hide-scrollbar'
        disabled={!isActive}
        trigerBtn={
            <button
                type="button"
                className="text-basePrimary underline px-4"
                > Add Key Result
            </button>
        }
    >
        <section className="">
            <div className="border-b pb-3 w-full">
                <h4 className="text-lg font-bold">New Key Result</h4>
                <p className="pt-3 font-semibold">{goalData?.goalName}</p>
            </div>


            <form className="pt-8 space-y-3 max-w-lg mx-auto" onSubmit={handleSubmit} >
            <CustomInput
                label="Key result title"
                name="keyResultTitle"
                value={keyResultData?.keyResultTitle || ''}
                error={errors.keyResultTitle}
                placeholder="Enter title"
                isTextarea
                isRequired
                onChange={handleChange}
            />

            {/* Description */}
            <CustomInput
                label="Description"
                name="description"
                value={keyResultData?.description || ''}
                error={errors.description}
                placeholder="Enter detailed description of the goal"
                isTextarea
                // isRequired
                onChange={handleChange}
            />

            {/* Owner */}
            <CustomSelect
                label="Owner"
                placeholder="Select an owner"
                options={ownerOptions}
                error={errors?.keyResultOwner!}
                value={keyResultData?.keyResultOwner || ''}
                onChange={handleSelectChange}
            />

            {/* <div className="flex flex-col sm:flex-row items-center w-full gap-3">
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        value={keyResultData?.startDate!}
                        onChange={(date) => handleDateChange(date!, 'startDate')}
                        placeholder="Pick a start date"
                        error={errors?.startDate!}
                        className='w- '
                        isRequired
                    />

                    <DatePicker
                        label="End Date"
                        name="endDate"
                        value={keyResultData?.endDate!}
                        onChange={(date) => handleDateChange(date!,'endDate')}
                        placeholder="Pick an end date"
                        className='py- '
                        error={errors?.endDate!}
                        isRequired
                    />
            </div> */}

            <div className="flex flex-col sm:flex-row items-center w-full gap-3">
                <GoalDatePicker
                    label="Start Date"
                    name="startDate"
                    value={keyResultData?.startDate!}
                    onChange={(date) =>{ 
                        handleDateChange(date!, 'startDate')
                        setKeyResultData((prev)=>{
                        return {
                            ...prev,
                            endDate: '',
                        }
                        })
                    }}
                    placeholder="Pick a start date"
                    error={errors?.startDate!}
                    isRequired
                    isDayDisabled={isStartDayDisabled}
                />
                <GoalDatePicker
                    label="End Date"
                    name="endDate"
                    value={keyResultData?.endDate!}
                    onChange={(date) => handleDateChange(date!,'endDate')}
                    placeholder="Pick an end date"
                    className='py- '
                    error={errors?.endDate!}
                    isRequired
                    isDayDisabled={isEndDayDisabled}
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
                                        measurementType: type
                                    }
                                })}
                                className={`
                                ${keyResultData?.measurementType===type ? 'border-purple-300 border-2':''} w-24 h-24 flex flex-col rounded-md items-center justify-center border hover:shadow duration-300 text-sm`}>
                                    {icon}
                                    {label}
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>

            {
                keyResultData?.measurementType==='value' &&
                <ValueMetrics keyResultData={keyResultData} handleChange={handleChange} errors={errors}/>
            }

            <div className=" w-full pt-4 flex flex-col items-center">
                {errors?.general && <small className="text-[12px] text-center text-red-600">{errors.general}</small>}
                {success && <small className="text-[12px] text-center text-basePrimary">{success}</small>}
                <Button type='submit' disabled={isSubmitting} className='bg-basePrimary'>
                    {isSubmitting ? 'submitting...' : 'Save'}
                </Button>
            </div>
            </form>
        </section>
    </CenterModal>
  )
}

export default KeyResultForm


export const metricsTypes:{
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