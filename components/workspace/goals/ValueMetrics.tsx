import React from 'react'
import CustomInput from '../ui/CustomInput'
import { KeyResult } from '@/types/goal'

const ValueMetrics = ({errors, keyResultData, handleChange}:
  {errors:{[key:string]: string|null}, handleChange:(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>void, keyResultData:KeyResult}) => {
    //  console.log({keyResultData})
  return (
    <div className='space-y-3'>
        <div className="grid sm:grid-cols-2 gap-x-2 gap-y-4">
        <CustomInput
                label="Start Value"
                name="startValue"
                value={keyResultData?.startValue!}
                error={errors.startValue}
                placeholder="0.0"
                type='number'
                isRequired
                onChange={handleChange}
            />
            <CustomInput
                label="Target Value"
                name="targetValue"
                value={keyResultData?.targetValue!}
                error={errors.targetValue}
                placeholder="0.0"
                type='number'
                isRequired
                onChange={handleChange}
            />
        </div>
        <div className="flex items-center flex-col gap-2">
        <CustomInput
                label="Unit"
                name="unit"
                value={keyResultData?.unit!}
                error={errors.unit}
                placeholder="Enter unit"
                type='text'
                isRequired
                onChange={handleChange}
            />

        </div>
        
    </div>
  )
}

export default ValueMetrics