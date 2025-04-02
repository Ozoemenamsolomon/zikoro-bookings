import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib";

interface Option {
  value: any;
  label: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface CustomSelectProps {
  label?: string;
  className?: string;
  contentStyle?: string;
  error?: string;
  value?: string;
  name?: string;
  noOptionsLabel?:string;
  placeholder?: string;
  isRequired?: boolean // New prop for compulsory fields
  options: Option[] | OptionGroup[];
  onChange?: (value: any, field?: string) => void;
  setError?: (value: any, field?: string) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error,
  placeholder = "Select an option",
  noOptionsLabel = "No options available",
  options,
  isRequired = false, // Default to false for non-compulsory
  onChange,
  value,
  name,className,setError,contentStyle,
}) => {
  const isGrouped =
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === "object" &&
    "options" in options[0];

    const handleValueChange = (newValue: any) => {
      if (onChange) {
        onChange(newValue, name);
      }
      if (setError) {
        setError((prev: any) => ({
          ...prev,
          general: '',
          [name!]: '',
        }));
      }
    };
    
// console.log({value,name})
  const renderOptions = () => {
    if (!options || options.length === 0) {
      return (
        <SelectItem disabled value="no-options" className="py-8 text-center flex justify-center max-w-[20rem] mx-auto">
            {noOptionsLabel}
        </SelectItem>
      );
    }

    return isGrouped
      ? (options as OptionGroup[]).map((group, index) => (
          <SelectGroup key={index}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((item, idx) => (
              <SelectItem key={idx} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))
      : (options as Option[]).map((item, idx) => (
          <SelectItem key={idx} value={item.value}>
            {item.label}
          </SelectItem>
        ));
  };

  return (
    <div className={cn("w-full",)}>
      {label && (
        <label htmlFor={name} className="block text-sm   text-gray-600 mb-1">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}      
      
      <Select
        name={name}
        value={value || placeholder}
        onValueChange={(newValue) =>
          newValue !== "placeholder" ? handleValueChange(newValue) : null
        }
      >
        <SelectTrigger className={cn("w-full h-12 px-4 py-2 border rounded-lg focus:border-purple-300", className)}>
          <SelectValue>
            {value
              ? options.find((opt) =>
                  isGrouped
                    ? (opt as OptionGroup).options.some((o) => o.value === value)
                    : (opt as Option).value === value
                )?.label
              : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className={cn("max-h-60 overflow-y-auto", contentStyle)}>
          {/* Render Actual Options */}
          {renderOptions()}
        </SelectContent>
      </Select>
      {error && <small className="mt-1 text-[12px] text-red-500">{error}</small>}
    </div>
  );
};
