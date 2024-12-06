import { cn } from '@/lib/utils'
import React, { InputHTMLAttributes, TextareaHTMLAttributes, FC } from 'react'

interface InputCustomProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  value: string | number | undefined
  error?: string | null
  className?: string
  type?: string
  isTextarea?: boolean // Toggle between input and textarea
  isRequired?: boolean // New prop for compulsory fields
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const CustomInput: FC<InputCustomProps> = ({
  label,
  name,
  value,
  error,
  className,
  type = 'text',
  placeholder,
  onChange,
  isTextarea = false,
  isRequired = false, // Default to false for non-compulsory
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm   text-gray-600 mb-1">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value as string | number}
          placeholder={placeholder}
          className={cn(`px-4 py-3 w-full border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-200 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`, className)}
          onChange={onChange}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} // Cast props for textarea
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          className={cn(`px-4 py-3 w-full border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-200 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`, className)}
          onChange={onChange}
          {...props} // Spread additional props like disabled, maxLength, etc.
        />
      )}
      {error && <small className="mt-1 text-[12px] text-red-500">{error}</small>}
    </div>
  )
}

export default CustomInput
