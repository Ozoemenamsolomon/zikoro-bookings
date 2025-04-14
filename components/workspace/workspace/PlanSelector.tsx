import { CustomSelect } from '@/components/shared/CustomSelect'
import { OrganizationInput } from '@/types'
import React, { Dispatch, SetStateAction } from 'react'

const PlanSelector = ({plans,subscriptionPlan, setFormData, setError, error}:{
    plans:{label:string,value:string}[],
    subscriptionPlan:string, 
    setFormData:Dispatch<SetStateAction<OrganizationInput>>
    setError: (value: any, field?: string) => void;
    error:string

}) => {
  return (
    <CustomSelect
        label='Select subscription plan'
        isRequired
        error={error}
        setError={setError}
        options={plans}
        value={subscriptionPlan}  
        name="subscriptionPlan"
        onChange={(newValue) => setFormData((prev)=>({
          ...prev,
          subscriptionPlan:newValue
        }))}  
        placeholder="Select a plan"
        className=" w-full"
        contentStyle="w-full"
    />

  )
}

export default PlanSelector