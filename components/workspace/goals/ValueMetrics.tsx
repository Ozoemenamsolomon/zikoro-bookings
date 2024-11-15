import React, { useCallback } from 'react'
import CustomInput from '../ui/CustomInput'
import { useGoalContext } from '@/context/GoalContext'

const ValueMetrics = () => {
    const {metricValue, setMetricValue,} = useGoalContext()
      // Handle change for inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMetricValue(prev => ({ ...prev, [name]: value }))
  }, [])
  return (
    <div className='space-y-3'>
        <div className="grid sm:grid-cols-2 gap-x-2 gap-y-4">
        <CustomInput
                label="Start Value"
                name="startValue"
                value={metricValue.startValue}
                // error={errors.startValue}
                placeholder="0.0"
                type='number'
                isRequired
                onChange={handleChange}
            />
            <CustomInput
                label="Target Value"
                name="targetValue"
                value={metricValue.targetValue}
                // error={errors.targetValue}
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
                value={metricValue.unit}
                // error={errors.unit}
                placeholder="Enter unit"
                type='text'
                onChange={handleChange}
            />
            <button type="button" className='text-red text-sm font-semibold'>Remove unit</button>
        </div>
        
    </div>
  )
}

export default ValueMetrics