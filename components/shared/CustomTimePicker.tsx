import { cn } from "@/lib";
import { format, parse } from "date-fns";
import React, { useRef, useState } from "react";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css"; // Optional for better styling

interface TimePickerProps {
  label?: string;
  value: string;
  className?: string;
  onChange?: (time: string) => void;
}

const TimePickerP: React.FC<TimePickerProps> = ({ label, value, onChange, className }) => {
  const [time, setTime] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawTime = e.target.value; // e.g., "14:30"
    const parsedTime = parse(rawTime, "HH:mm", new Date()); // Convert string to Date
    const formattedTime = format(parsedTime, "hh : mm a"); // Format to 12-hour with AM/PM

    setTime(formattedTime);
    if (onChange) {
      onChange(formattedTime);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1  ")}>
      {label && <label className="font-semibold">{label}</label>}

      {/* Clickable display */}
      <div className={cn("relative", className)}>
      <span
        className=" cursor-pointer bg-transparent"
      >
        {time || '_______'}
      </span>

      {/* Hidden input for selecting time */}
      <input
        ref={inputRef}
        type="time"
        onChange={handleChange}
        onClick={() => inputRef.current?.showPicker()}
        className="opacity-0 absolute inset-0 cursor-pointer appearance-none"
      />
    </div>
    </div>
  );
};

export default TimePickerP;


interface CustomTimePickerProps {
  label?: string;
  value: string;
  onChange?: (time: string) => void;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ label, value, onChange }) => {
  const [time, setTime] = useState<string | null>(value);

  const handleChange = (newTime: string | null) => {
    setTime(newTime);
    if (onChange) onChange(newTime || "");
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold">{label}</label>}
      <TimePicker
        onChange={handleChange}
        value={time}
        disableClock={true} // Hide the clock UI
        clearIcon={null} // Hide the clear (X) button
        format="hh:mm a" // 12-hour format with AM/PM
        className=" bg-transparent border-none outline-none focus:outline-none"
      />
    </div>
  );
};

