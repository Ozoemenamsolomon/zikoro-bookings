'use client'

import { CenterModal } from '@/components/shared/CenterModal'
import React, { useCallback, useState } from 'react'
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

const KeyResultForm = ({isActive, mode}:{isActive?:boolean, mode?:string}) => {
  const {push,refresh} = useRouter()
  const {keyResultData, setKeyResultData, goalData, metricValue, isSubmitting, setIsSubmitting,} = useGoalContext()

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const [success, setSuccess] = useState<string>('')
  
  const ownerOptions = [
    // { value:user?.id,  
    //   label: `${user?.firstName} ${user?.lastName}` },
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
  }, [])

  const handleDateChange = (date: Date | null, field:string) => {
    setKeyResultData((prevData) => ({ ...prevData, [field]: date }));
  };

  const handleSelectChange = (value: number) => {
    const selectedOption = ownerOptions.find(option => option.value === Number(value));
    if (!selectedOption) {
      return;
    }
        setKeyResultData((prevData) => ({ ...prevData, keyResultOwner: selectedOption?.value }));
  };

   const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!keyResultData.keyResultTitle) newErrors.keyResultTitle = 'Goal name is required.'
    if (!keyResultData.description) newErrors.description = 'Description is required.'
    if (!keyResultData.keyResultOwner) newErrors.keyResultOwner = 'Please select an owner.'
    if (!keyResultData.startDate) newErrors.startDate = 'Start date is required.'
    if (!keyResultData.endDate) newErrors.endDate = 'End date is required.'
    if (goalData.startDate && goalData.endDate && new Date(goalData.startDate) > new Date(goalData.endDate)) {
        newErrors.endDate = 'End date must be after start date.';
      }
    //   TODO: add metricValue errors
    // if (keyResultData?.measurementType && !metricValue.endDate) newErrors.endDate = 'End date is required.'
    // if (keyResultData?.measurementType && !metricValue.endDate) newErrors.endDate = 'End date is required.'
    // if (keyResultData?.measurementType && !metricValue.endDate) newErrors.endDate = 'End date is required.'

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
                            currentValue: metricValue.startValue,
                            targetValue: metricValue.targetValue,
                            unit: metricValue.unit ,
                        },
                        timeLineData: {
                            organizationId: goalData.organization,
                            createdBy: goalData.createdBy,
                            value: keyResultData?.currentValue
                        },
                    }
                })
                if (error) {
                    setErrors({general:error})
                } else {
                    // console.log(data)
                    toast.success('New key result added')
                    // setSuccess('Goal created successfully')
                    refresh()
                }
            } else {
                const { data, error } = await PostRequest({url:'/api/goals/create', 
                    body:{ 
                        goalData,
                        keyResultData:{
                            ...keyResultData,
                            organization: goalData.organization,
                            createdBy: goalData.createdBy,
                            currentValue: metricValue.startValue,
                            targetValue: metricValue.targetValue,
                            unit: metricValue.unit ,
                        },
                        timeLineData: {
                            organizationId: goalData.organization,
                            createdBy: goalData.createdBy,
                            value: keyResultData?.currentValue
                        },
                    }
                })
                if (error) {
                    setErrors({general:error})
                } else {
                    // console.log(data)
                    toast.success('Goal created')
                    setSuccess('Goal created successfully')
                    push(`${urls.contactsGoals}/details/${data.id}`)
                }
            }
        } catch (error) {
          console.error('Submission failed:', error)
        } finally {
          setIsSubmitting(false)
        }
      }

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
                isRequired
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

            <div className="flex flex-col sm:flex-row items-center w-full gap-3">
                    {/* Start Date */}
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        value={keyResultData?.startDate!}
                        onChange={(date) => handleDateChange(date!, 'startDate')}
                        placeholder="Pick a start date"
                        error={errors?.startDate!}
                        className='w- '
                    />

                    {/* End Date */}
                    <DatePicker
                        label="End Date"
                        name="endDate"
                        value={keyResultData?.endDate!}
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
                <ValueMetrics errors={errors}/>
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