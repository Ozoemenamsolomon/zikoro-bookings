import React from 'react';
import { FormProps } from '@/types/appointments'; 
import DateTimeScheduler from '../ui/DateTimeScheduler';

const SetAvailability: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
}) => {

  return (
      <DateTimeScheduler setFormData={setFormData} formData={formData!} errors={errors}/>
  );
};

export default SetAvailability;
