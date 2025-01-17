import React from 'react'
import KeyResultForm from './KeyResultForm'
import { Goal } from '@/types/goal'

const AddKeyResult = ({goal, isOpen, openModal, mode}:
  {goal?: Goal, isOpen?:boolean, openModal?:(open:boolean)=>void, mode?:string}) => {
    
  return (
    <div className=" w-full py-4 flex flex-col items-center">
        <KeyResultForm goal={goal} isOpen={isOpen} openModal={openModal} mode={mode}/>
        <small>Define a method for measuring this goal</small>
    </div>
  )
}

export default AddKeyResult