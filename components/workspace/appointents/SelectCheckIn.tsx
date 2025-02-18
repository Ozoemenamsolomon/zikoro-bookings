import TimePickerP, { CustomTimePicker } from "@/components/shared/CustomTimePicker";
import React, { useState } from "react";

const SelectCheckIn = () => {
  const [checkInTime, setCheckInTime] = useState<string>("");
  const [checkOutTime, setCheckOutTime] = useState<string>("");

  return (
    <div className="flex flex-col justify-center gap-3">
      <div className="flex gap-4 items-end pb-1 border-b border-gray-700">
        <label htmlFor="check-in" className="font-semibold">Check-out:</label>
        <TimePickerP value={checkInTime} onChange={setCheckInTime} />
      </div>

      <div className="flex gap-4 items-end pb-1 border-b border-gray-700">
        <label htmlFor="check-out" className="font-semibold">Check-out:</label>
        <CustomTimePicker value={checkOutTime} onChange={setCheckOutTime} />
      </div>
    </div>
  );
};

export default SelectCheckIn;
