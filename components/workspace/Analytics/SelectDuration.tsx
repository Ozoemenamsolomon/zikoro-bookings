import SimpleSelect from '@/components/shared/SimpleSelect'
import React, { Dispatch, SetStateAction } from 'react'

const SelectDuration = ({type,setType}:{
  type:string, setType: (type:string)=>void
}) => {
  const options = ['weekly','monthly','yearly']

  return (
    <SimpleSelect
      options={options}
      value={type}
      setValue={setType}
    />
  )
}

export default SelectDuration