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

interface Option {
  value: string;
  label: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface CustomSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: Option[] | OptionGroup[];
  onChange?: (value: string, field?:string) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error,
  placeholder = "Select an option",
  options,
  onChange,
}) => {
  const isGrouped = Array.isArray(options) && typeof options[0] === "object" && "options" in options[0];

  return (
    <div className="w-full">
      {label && <label className="block text-sm mb-1 font-">{label}</label>}
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full h-12 px-4 py-2 border rounded-lg focus:outline-none">
          <SelectValue placeholder={placeholder} className="focus:outline-none"/>
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {isGrouped
            ? (options as OptionGroup[]).map((group, index) => (
                <SelectGroup key={index}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            : (options as Option[]).map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
      {error && <small className="mt-1 text-[12px] text-red-500">{error}</small>}
      </div>
  );
};