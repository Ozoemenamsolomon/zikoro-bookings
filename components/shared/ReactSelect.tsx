import React, { useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";
import { cn } from "@/lib";

interface OptionType {
  value: string | number;
  label: string;
}

interface CreatableReactSelectProps {
  field: any;
  options?: OptionType[];
  isClearable?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
}

export const CReactSelect: React.FC<CreatableReactSelectProps> = ({
    field,
    options = [
      { value: "options", label: "Option 1" },
      { value: "sd", label: "Option 2" },
      { value: "gh", label: "Option 3" },
    ],
    isClearable = true,
    isMulti = true,
    isSearchable = true,
  }) => {
    const memoizedOptions = useMemo(() => options, [options]);
  
    const handleChange = (
      newValue: MultiValue<OptionType> | SingleValue<OptionType>,
      actionMeta: ActionMeta<OptionType>
    ) => {
      if (isMulti) {
        field.onChange((newValue as MultiValue<OptionType>).map(option => option.value));
      } else {
        field.onChange((newValue as SingleValue<OptionType>)?.value ?? null);
      }
    };
  
    return (
      <Select
        value={
          isMulti
            ? memoizedOptions.filter(option => field.value.includes(option.value))
            : memoizedOptions.find(option => option.value === field.value)
        }
        isClearable={isClearable}
        options={memoizedOptions}
        isMulti={isMulti}
        isSearchable={isSearchable}
        name={field.name}
        onChange={handleChange}
      />
    );
  };

interface ReactSelectProps {
  name: string;
  options: OptionType[];
  value: string | number | (string | number)[]; // Support single or multiple values
  onChange: (name: string, value: string | number | (string | number)[], index?:number) => void;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
  className?: string;
  index?: number;
  label?:string;
  error?: string;
  isRequired?:boolean;
  setError?: React.Dispatch<React.SetStateAction<any>>;
}
  
export const ReactSelect: React.FC<ReactSelectProps> = ({
  name,
  options,
  value,
  onChange,
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  placeholder = 'Select...',
  className,
  index,label,
  error,setError,isRequired,
}) => {
  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [options]);

  const handleChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    if (isMulti) {
      const selectedValues = (newValue as MultiValue<OptionType>).map(option => option.value);
      onChange(name, selectedValues, index);
    } else {
      onChange(name, (newValue as SingleValue<OptionType>)?.value ?? '', index);
    }
    setError &&
      setError((prev:any) => {
        return {
          ...prev,
          general: '',
          [name]: '',
        };
      });
  };

  return (
    <div className="w-full">
    {label && (
        <label htmlFor={name} className="block text-sm   text-gray-600 mb-1">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
    <Select
      id={name}
      value={
        isMulti
          ? memoizedOptions.filter(option => (value as (string | number)[]).includes(option.value))
          : memoizedOptions.find(option => option.value === value)
      }
      isClearable={isClearable}
      isSearchable={isSearchable}
      options={memoizedOptions}
      isMulti={isMulti}
      placeholder={placeholder}
      className={cn('h-10 hide-scrollbar', className)}
      onChange={handleChange}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state?.isFocused
            ? "#e9d5ff"
            : "",
          "&:hover": {
            borderColor: "#e9d5ff",
          },
          height: "100%",
          // minHeight: minHeight || baseStyles.minHeight,
         // backgroundColor: bgColor || "#ffffff",
          boxShadow: "0px",
          // borderRadius: "6px",
          // backgroundImage: 'linear-gradient(to right, #001FCC19 0%, #9D00FF19 100%)',
          // border: '0px',
          // borderColor: '#e2e8f0'
        }),

        option: (baseStyles, state) => ({
          ...baseStyles,
          textAlign: "start",
          color: state?.isSelected ? "black" : "black",
          backgroundColor: state?.isFocused ? "#e9d5ff" : "",
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          textAlign: "start",
          textDecoration: "capitalize",
          fontSize: "13px",
          padding: "4px",
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          textAlign: "start",
          color: '#6b7280',
          fontSize: "13px",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "6px",
          zIndex: 100,
          fontSize: "13px",
        }),
        dropdownIndicator: (baseStyle) => ({
          ...baseStyle,
          borderRight: "0px",
        }),
      }}
    />
    {error ? <p className="text-red-600 text-[12px] pt-1">{error}</p> : null}
    </div>
  );
};
  

interface CreatableSelectProps {
  name: string;
  options: Array<{ label: string; value: string }>;
  value: string | string[] | null;
  onChange: (name: string, value: string | string[], index?:number) => void;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
  className?: string;
  index?: number;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<any>>;
}

const CustomCreatableSelect: React.FC<CreatableSelectProps> = ({
  name,
  options,
  value,
  onChange,
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  placeholder = 'Select...',
  className,
  index,
  error,setError,
}) => {
  const memoizedOptions = useMemo(() => options, [options]);
  const formatValue = (
    value: string | string[] | null,
  ): SingleValue<{ label: string; value: string }> | MultiValue<{ label: string; value: string }> => {
    if (isMulti && Array.isArray(value)) {
      return value.map((val) => ({ label: val, value: val }));
    } else if (!isMulti && typeof value === 'string') {
      return value ? { label: value, value: value } : null;
    }
    return null;
  };
  const handleChange = (
    newValue: SingleValue<{ label: string; value: string }> | MultiValue<{ label: string; value: string }>,
    actionMeta: ActionMeta<{ label: string; value: string }>
  ) => {
    if (isMulti) {
      const selectedValues = (newValue as MultiValue<{ label: string; value: string }>).map((option) => option.value);
      onChange(name, selectedValues, index);
    } else {
      const selectedValue = (newValue as SingleValue<{ label: string; value: string }>)?.value || '';
      onChange(name, selectedValue, index);
    }

    setError &&
      setError((prev:any) => {
        return {
          ...prev,
          general: '',
          [name]: '',
        };
      });
  };

  return (
    <div>
    <CreatableSelect
      isMulti={isMulti}
      options={memoizedOptions}
      value={formatValue(value)}
      onChange={handleChange}
      placeholder={placeholder}
      classNamePrefix="custom-creatable-select"
      isClearable={isClearable}
      isSearchable={isSearchable}
      className={cn('h-10 hide-scrollbar', className)}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state?.isFocused
            ? "#e9d5ff"
            : "",
          "&:hover": {
            borderColor: "#e9d5ff",
          },
          height: "100%",
          boxShadow: "0px",
        }),

        option: (baseStyles, state) => ({
          ...baseStyles,
          textAlign: "start",
          color: state?.isSelected ? "black" : "black",
          backgroundColor: state?.isFocused ? "#e9d5ff" : "",
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          textAlign: "start",
          textDecoration: "capitalize",
          fontSize: "13px",
          padding: "4px",
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          textAlign: "start",
          color: '#6b7280',
          fontSize: "13px",
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "6px",
          zIndex: 100,
          fontSize: "13px",
        }),
        dropdownIndicator: (baseStyle) => ({
          ...baseStyle,
          borderRight: "0px",
        }),
      }}
    />
    {error ? <p className="text-red-600 text-[12px] pt-1">{error}</p> : null}
    </div>
  );
};

export default CustomCreatableSelect;


