import { UpDownArrow } from "@/constants";
import { cn } from "@/lib";
import { useClickOutside } from "@/lib/useClickOutside";
import { AppointmentFormData, AppointmentLink } from "@/types/appointments";
import { ChevronDown } from "lucide-react";
import { useRef, useState, RefObject, useEffect } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectInputProps {
  options: Option[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  name: string;
  value: string | number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  setError?: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  icon?: string;
  error?: string;
  type?:string;
  pattern?:string;
  onChange?: (name: string, value: string | number) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  setFormData,
  name,
  value,
  label,
  placeholder = 'Select',
  className,
  disabled,
  icon,
  setError,
  error,
  onChange,
  type,
  pattern,
}) => {
  const containerRef: RefObject<HTMLDivElement> = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    if(value) setInputValue(value)
  }, [value])

  const handleChange = (selectedValue: string | number) => {
    console.log({selectedValue})
    setInputValue(selectedValue.toString());
    if (onChange) {
      onChange(name, selectedValue);
    } else {
      setFormData((prev: AppointmentLink | any) => ({ ...prev, [name]: selectedValue }));
    }
    setIsOpen(false);
    setError &&
      setError((prev: AppointmentLink | any) => {
        return {
          ...prev,
          general: '',
          [name]: '',
        };
      });
  };

  
  useClickOutside(containerRef, () => setIsOpen(false));

  const filteredOptions = options.filter(option =>
    String(option.value).toLowerCase().includes(String(inputValue).toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(type==='number'){

    }
    setInputValue(e.target.value);
    setIsOpen(true);
    setFormData((prev:AppointmentFormData)=>{
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  };
  return (
    <>
    <div className={cn("relative", )}>
      {label && (
        <label className="block font- mb-2" htmlFor={name}>
          {label}
        </label>
      )}
      <div onClick={() => setIsOpen(!isOpen)} ref={containerRef} 
      className={cn(
        "relative py-3 px-2 flex items-center gap-1 border rounded-md",
        disabled ? "bg-gray-300 text-gray-300" : "hover:border-purple-300",
        isOpen && "border-purple-400 shadow-md w-20", className
      )}>
          <input
            type={"text"}
            disabled={disabled}
            name={name}
            value={inputValue}
            onChange={(e) => {
              if(type==='number'){
                const value = e.target.value;
                e.target.value = value.replace(/\D/g, ''); // Remove non-digit characters
                handleInputChange(e);
              } else {
                handleInputChange(e);
              }
            }}
            // onClick={() => setIsOpen(!isOpen)}
            className={cn(`w-full bg-transparent focus:ring-0 appearance-none focus:outline-none ${
              disabled ? 'cursor-not-allowed' : 'border-gray-300'
            }`,)}
            placeholder={placeholder }
            pattern={pattern||''}
          />
          <div  className="shrink-0 pointer-events-none">
            {icon ? <ChevronDown size={14} /> : <UpDownArrow  />}
          </div>
        </div>

        {isOpen && (
          <ul className={cn(`z-30 absolute py-2 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto hide-scrollbar`, className)}>
            {placeholder && !inputValue && (
              <li
                onClick={() => handleChange('')}
                className="cursor-pointer hover:bg-gray-200 px-4 py-1 text-gray-700"
              >
                {placeholder}
              </li>
            )}
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleChange(option.value)}
                className={`cursor-pointer capitalize hover:bg-gray-200 px-4 py- ${option.value === inputValue ? 'bg-gray-100' : ''}`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      
    </div>
    {error ? <p className="text-red-600 text-[12px] pt-1">{error}</p> : null}
    </>
  );
};
