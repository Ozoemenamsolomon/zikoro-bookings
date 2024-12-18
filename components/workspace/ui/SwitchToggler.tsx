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
