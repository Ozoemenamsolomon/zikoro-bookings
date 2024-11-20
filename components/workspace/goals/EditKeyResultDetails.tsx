'use client'

import { PenLine } from 'lucide-react';
import { CenterModal } from '@/components/shared/CenterModal';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';  
import { toast } from 'react-toastify';
import { PostRequest } from '@/utils/api';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useGoalContext } from '@/context/GoalContext';
import { urls } from '@/constants';
import { KeyResult } from '@/types/goal';
import { useRouter } from 'next/navigation';
import ValueMetrics from './ValueMetrics';
import CustomInput from '../ui/CustomInput';
import { CustomSelect } from '@/components/shared/CustomSelect';
import { DatePicker } from '../ui/DatePicker';
import { metricsTypes } from './KeyResultForm';

const EditKeyResultDetails = ({ keyResult, text }: { keyResult: KeyResult, text?:string }) => {
  
  const {push,refresh} = useRouter()
  const {contact} =useAppointmentContext()
  const {metricValue, setMetricValue, isSubmitting, setIsSubmitting,} = useGoalContext()
  const [keyResultData, setKeyResultData] = useState<KeyResult>()

  useEffect(() => {
        setKeyResultData(keyResult)
        setMetricValue((prev)=>{
            return {
                ...prev,
                targetValue: keyResult?.targetValue || 0,
                startValue: keyResult?.currentValue || 0,
                unit: keyResult?.unit || '',
            }
        })
  }, [keyResult])

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
  const [success, setSuccess] = useState<string>('')

  const ownerOptions = [
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
    const selectedOption = ownerOptions?.find(option => option.value === Number(value));
    if (!selectedOption) {
      return;
    }
        setKeyResultData((prevData) => ({ ...prevData, keyResultOwner: selectedOption?.value }));
  };

   const validateForm = () => {
    const newErrors: { [key: string]: string | null } = {}
    if (!keyResultData?.keyResultTitle) newErrors.keyResultTitle = 'Goal name is required.'
    // if (!keyResultData.description) newErrors.description = 'Description is required.'
    if (!keyResultData?.keyResultOwner) newErrors.keyResultOwner = 'Please select an owner.'
    if (!keyResultData?.startDate) newErrors.startDate = 'Start date is required.'
    if (!keyResultData?.endDate) newErrors.endDate = 'End date is required.'
    if (!keyResultData?.unit) newErrors.endDate = 'Unit is required.'

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
        const { data, error } = await PostRequest({url:'/api/goals/editKeyResult', 
            body:{ 
                keyResultData:{
                    ...keyResultData,
                    currentValue: metricValue.startValue,
                    targetValue: metricValue.targetValue,
                    unit: metricValue.unit ,
                },
            }
        })
        if (error) {
            setErrors({general:error})
        } else {
            // console.log(data)
            toast.success('Key result editted')
            setSuccess('Key result editted successfully')
            setKeyResultData({})
            refresh()
        }
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const metricTypeUi = metricsTypes?.find((item)=>item?.type===keyResultData?.measurementType)

  return (
    <CenterModal
      className="max-w-2xl w-full overflow-hidden"
      trigerBtn={
        <button className="flex justify-center text-sm">
           {text ? text : <><p>Edit</p> <PenLine size={18} /></> }
        </button>
      }
    >
      <section className="max-h-[95vh] w-full overflow-auto hide-scrollbar py-6">
            <div className="border-b pb-3 w-full ">
                <h4 className="text-lg font-bold px-4">Edit Key Result</h4>
            </div>

            <form className="pt-8 space-y-3 max-w-lg mx-auto" onSubmit={handleSubmit} >
            <CustomInput
                label="Key result title"
                name="keyResultTitle"
                value={keyResultData?.keyResultTitle || ''}
                error={errors?.keyResultTitle}
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
                error={errors?.description}
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
                <p className="pb-2">Progress tracking type</p>
                <div className="flex gap-4 flex-wrap w-full">
                    <div className={`
                        border-purple-300 border-2  w-24 h-24 flex flex-col rounded-md items-center justify-center hover:shadow duration-300 text-sm`}>
                        {metricTypeUi?.icon}
                        {metricTypeUi?.label}
                    </div>
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
  );
};

export default EditKeyResultDetails