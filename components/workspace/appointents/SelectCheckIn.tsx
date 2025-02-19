import TimePickerP, { CustomTimePicker } from "@/components/shared/CustomTimePicker";
import React, { Dispatch, SetStateAction, useState } from "react";
 

const SelectCheckIn = ({timeData,setTimeData }:{
  timeData:{checkIn:string,checkOut:string}
  setTimeData:Dispatch<SetStateAction<{checkIn:string,checkOut:string}>>
}) => {
 
  return (
    <div className="flex flex-col justify-center gap-3">
      <div className="flex gap-4 items-end pb-1 border-b border-gray-700">
        <label htmlFor="check-in" className="font-semibold">Check-out:</label>
        <TimePickerP value={timeData.checkIn} onChange={(time:string)=>setTimeData((prev)=>{
          return {
            ...prev,
            checkIn:time
          }
        })} />
      </div>

      <div className="flex gap-4 items-end pb-1 border-b border-gray-700">
        <label htmlFor="check-out" className="font-semibold">Check-out:</label>
        <TimePickerP value={timeData.checkOut} onChange={(time:string)=>setTimeData((prev)=>{
          return {
            ...prev,
            checkOut:time
          }
        })}/>
      </div>
    </div>
  );
};

export default SelectCheckIn;
