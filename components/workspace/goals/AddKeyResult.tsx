import React from 'react'
import KeyResultForm from './KeyResultForm'
import { Goal } from '@/types/goal'

const AddKeyResult = ({goal, isActive, mode}:{goal?: Goal, isActive:boolean, mode?:string}) => {
    
  return (
    <div className=" w-full py-4 flex flex-col items-center">
        <KeyResultForm goal={goal} isActive={isActive} mode={mode}/>
        <small>Define a method for measuring this goal</small>
    </div>
  )
}

export default AddKeyResult