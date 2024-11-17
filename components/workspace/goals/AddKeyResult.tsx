import React from 'react'
import KeyResultForm from './KeyResultForm'

const AddKeyResult = ({isActive, mode}:{isActive:boolean, mode?:string}) => {
    
  return (
    <div className=" w-full pb-4 flex flex-col items-center">
        <KeyResultForm  isActive={isActive} mode={mode}/>
        <small>Define a method for measuring this goal</small>
    </div>
  )
}

export default AddKeyResult