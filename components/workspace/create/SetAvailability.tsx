import React from 'react';
import { FormProps } from '@/types/appointments'; 
import DateTimeScheduler from '../ui/DateTimeScheduler';

const SetAvailability: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {

  return (
      <DateTimeScheduler setFormData={setFormData} formData={formData!} setErrors={setErrors} errors={errors}/>
  );
};

export default SetAvailability;
