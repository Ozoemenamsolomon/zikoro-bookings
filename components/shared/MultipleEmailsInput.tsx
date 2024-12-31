'use client';
import React, { useState, KeyboardEvent, ChangeEvent, useRef } from 'react';
import { X } from 'lucide-react';

interface MultipleEmailInputProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
  placeholder?: string;
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const MultipleEmailInput: React.FC<MultipleEmailInputProps> = ({
  emails,
  setEmails,
  placeholder = 'Add emails and press Enter',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Handle Add Email */
  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (isValidEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
      setEmails([...emails, trimmedEmail]);
      setInvalidEmails((prev) => prev.filter((e) => e !== trimmedEmail));
    } else {
      setInvalidEmails((prev) => (prev.includes(trimmedEmail) ? prev : [...prev, trimmedEmail]));
    }
    setInputValue('');
  };

  /** Handle Remove Email */
  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
    setInvalidEmails(invalidEmails.filter((e) => e !== email));
  };

  /** Handle Key Down */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmail(inputValue);
    }
    if (e.key === 'Backspace' && inputValue === '') {
      removeEmail(emails[emails.length - 1]);
    }
  };

  /** Handle Input Change */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /** Handle Input Focus */
  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="border rounded-md p-2 sm:p-4 flex flex-wrap gap-1 min-h-[8rem] items-start justify-start"
      onClick={handleFocus}
    >
      {emails.map((email) => (
        <div
          key={email}
          className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm ${
            invalidEmails.includes(email) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          <pre className='max-w-60 sm:max-w-80 truncate'>{email}</pre>
          <button
            type="button"
            onClick={() => removeEmail(email)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={emails.length === 0 ? placeholder : ''}
        className="flex-1 outline-none text-sm py-1"
      />
    </div>
  );
};

export default MultipleEmailInput;
