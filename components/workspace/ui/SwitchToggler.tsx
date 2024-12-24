import React, { useState } from 'react';

interface SwitchTogglerProps {
  isOn?: boolean; // Optional controlled state
  onChange?: (state: boolean) => void; // Callback when toggler state changes
}

const SwitchToggler: React.FC<SwitchTogglerProps> = ({ isOn: controlledIsOn, onChange }) => {
  const [isInternalOn, setInternalOn] = useState(false);

  const isOn = controlledIsOn !== undefined ? controlledIsOn : isInternalOn;

  const toggleSwitch = () => {
    const newState = !isOn;
    if (controlledIsOn === undefined) {
      setInternalOn(newState); // Update internal state if uncontrolled
    }
    onChange?.(newState); // Trigger callback
  };

  return (
    <div
      className={`relative flex items-center w-14 h-7 cursor-pointer rounded-full transition-colors duration-200 ${
        isOn ? 'bg-blue-600 ring-blue-600' : 'bg-slate-300 ring-slate-300'
      }`}
      role="switch"
      aria-checked={isOn}
      onClick={toggleSwitch}
    >
      <div
        className={`absolute w-6 h-6 bg-white rounded-full transition-transform transform duration-200 ${
          isOn ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
      <div className="flex justify-between w-full px-1.5 text-[10px] font-semibold text-white">
        <span>{isOn ? 'ON' : ''}</span>
        <span>{!isOn ? 'OFF' : ''}</span>
      </div>
    </div>
  );
};

export default SwitchToggler;


interface TogglerProps {
  value?: string; // Currently selected value
  options: [string, string]; // Two toggle options
  onChange?: (value: string) => void; // Callback when toggled
}

export const Toggler: React.FC<TogglerProps> = ({
  value,
  options = ['', ''],
  onChange,
}) => {
  const [selected, setSelected] = useState(value || options[0]);

  const toggleSwitch = () => {
    const newValue = selected === options[0] ? options[1] : options[0];
    setSelected(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={`relative flex items-center  w-12 h-6 p- cursor-pointer rounded-full bg-gray-300 transition-colors duration-300 p- `}
      role="switch"
      aria-checked={selected === options[1]}
      onClick={toggleSwitch}
    >
      <div
        className={`absolute w-[22px] h-[22px] bg-white rounded-full shadow-md transition-transform duration-300 ${
          selected === options[0] ? 'translate-x-0.5' : 'translate-x-[24px]'
        }`}
      />
    </div>
  );
};
