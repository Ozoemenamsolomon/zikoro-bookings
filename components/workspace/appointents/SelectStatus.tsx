import { AppointmentStatuses, Box, TickedBox } from '@/constants'
import React, { useState } from 'react'
import SelectCheckIn from './SelectCheckIn';
import { ChevronDown } from 'lucide-react';

const SelectStatus = () => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>('In attendance');
    // const [show, setShow] = useState<string>('');
    
    const handleClick = (selected:string) => {
      // if(selected==='In attendance'){
      //   setShow(selected)
      // } else {
      //   setShow('')
      // }
      setSelectedStatus(selected)
    }
  
  return (
      <div className="text-center flex flex-col gap-6 justify-center">
        <h6 className="text-sm text-gray-600">
            Update booking status  of this contact
        </h6>

        <button onClick={()=>setSelectedStatus('Select status')} className=" py-4 border-b border-gray-500 w-44 text-center mx-auto flex gap-6 justify-center items-center ">
          <p className={selectedStatus==='Select status'?'text-gray-500':"text-zikoroBlue"}>{selectedStatus}</p>
          <ChevronDown size={20}  />
        </button>

        <div className="flex flex-col items-center justify-center">
          {
            selectedStatus === 'In attendance' ?
            <SelectCheckIn/>
            :
            <div className=" space-y-3">
                  {AppointmentStatuses.map((status, i) => (
                    <button
                      key={i}
                      
                      className={`flex hover:font-semibold duration-300 items-center gap-3 w- `}
                      onClick={() => handleClick(status)}
                    >
                      <span>
                        {
                        selectedStatus === status ? 
                          <TickedBox />
                          :
                          <Box/>
                        }
                      </span>
                      {status}
                    </button>
                  ))}
            </div>
          }
        </div>
        <div className="flex justify-center">
          <button className="bg-basePrimary text-white font-semibold text-sm px-6 py-3 rounded-md">Update</button>
        </div>
    </div>
  )
}

export default SelectStatus