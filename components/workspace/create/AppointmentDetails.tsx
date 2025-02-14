import React, { useState } from 'react';
import { AppointmentFormData, FormProps } from '@/types/appointments'; 
import { Link, MapPin} from 'lucide-react';
import { GoogleMeetIcon, ZoomIcon } from '@/constants';
import RadioButtons from '../ui/RadioButtons';
import { SelectInput } from '../ui/CustomSelect';
import CategoryForm from './CategoryForm';
import { useAppointmentContext } from '@/context/AppointmentContext';
import CustomInput from '../ui/CustomInput';
import CustomCreatableSelect, { ReactSelect } from '@/components/shared/ReactSelect';

const AppointmentDetails: React.FC<FormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  handleChange,
}) => {
  const {selectedType} = useAppointmentContext()

  const handleSelectDuration = (name: string, value: string | string[]) => {
    // Convert the value to a number
    const numericValue = Number(value);
  
    // Validate if the value is a positive integer and a multiple of 5
    if (!Number.isInteger(numericValue) || numericValue <= 0 || numericValue % 5 !== 0) {
      return; 
    }
  
    setFormData &&
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
  };
  const handleSelect = (name:string,value:any)=> {
    setFormData&&setFormData((prev)=>{
      return {
        ...prev,
        [name]:value
      }
    })
  }
  return (
    <div className=" space-y-6">
      <div className='flex gap-3 items-end'>
        <div className='flex-1 '>
          <CustomInput
            label='Appointment Name'
            type='text'
            error={errors?.appointmentName}
            name='appointmentName'
            value={formData?.appointmentName || ''}
            placeholder='Enter Appointment Name'
            className='text-base'
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <p className='label'>Duration in minutes (Multiples of 5)</p>
        <CustomCreatableSelect
            name="duration"
            options={[
              {label:'15',value:'15'},
              {label:'30',value:'30'},
              {label:'45',value:'45'},
              {label:'60',value:'60'},
              {label:'90',value:'90'},
              {label:'120',value:'120'},
              {label:'180',value:'180'},
              {label:'210',value:'210'},
              {label:'360',value:'360'},
            ]}
            value={String(formData?.duration) || ''}
            onChange={handleSelectDuration}
            isClearable
            placeholder="Select"
            className="w-48 h-12"
            setError={setErrors}
            error={errors?.duration}
          />
        
      </div>

      <div className="pb-3">
          <div className='pb-3'>
            <label htmlFor="loctionType" className='pb-3'>Location type</label>
            <RadioButtons 
              formData={formData} 
              handleChange={handleChange!} 
              label1={'Onsite'} 
              label2={'Virtual'} 
              value1={'Onsite'} 
              value2={'Virtual'} 
              name='loctionType'
              />
          </div>
          {
            formData?.loctionType==='Virtual' ? 
            <label className='pl-8 pb-1 block'>Add meeting link</label> :
            <label className='pl-8 pb-1 block'>Add meeting location address</label>
          }
          
          {
          // formData?.loctionType==='Onsite' ? 
            <div className={` flex gap-2 items- `}>
                {
                  formData?.loctionType==='Onsite'?
                  <MapPin size={24} className='mt-2 flex-shrink-0 text-gray-600'/> : 
                  <Link size={24} className='mt-2 flex-shrink-0 text-gray-600'/>
                }
                <div className="w-full">
                  
                  <CustomInput
                    type='text'
                    error={errors?.locationDetails}
                    name='locationDetails'
                    value={formData?.locationDetails || ''}
                    placeholder='Enter Location'
                    className=' w-full'
                    onChange={handleChange}
                  />
                </div>
            </div>
              
          }
      </div>


        { selectedType==='single' ?
          <>
          <div className=" gap-2 items-center">
              <CustomInput
                type='text'
                label='Appointment Description (optional)'
                error={errors?.note}
                name='note'
                value={formData?.note || ''}
                placeholder='Add notes for appointment here'
                className=' w-full'
                onChange={handleChange}
                isTextarea
              />
            </div>

            <div className="flex   gap-4 justify-between items-center">
            <div  className="flex-1">
              <h5 className="label">Make this a paid appointment</h5>
              <p className="text-sm text-gray-600">Guests will be charged to book this appointment</p>
              <small className='italic'>Coming soon</small>
            </div>
            <div
                className={` flex-shrink-0 ${formData?.isPaidAppointment ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} mr- w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `}
                // onClick={()=>{
                //   setFormData && setFormData((prev:AppointmentFormData)=>{
                //     return {
                //       ...prev,
                //       isPaidAppointment: !prev.isPaidAppointment,
                //       paymentGateway: prev.isPaidAppointment ? '' : 'Zikoro manage',
                //       curency: '',
                //       amount: null,
                //     }
                //   })
                //   }}
              >   
                <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${formData?.isPaidAppointment ? 'translate-x-7' : ''}`}></div>
            </div>
            </div> 

            <div className={`${formData?.isPaidAppointment ? 'max-h-screen visible':'max-h-0 invisible overflow-hidden'}  relative z-30 transform  transition-all duration-300  `}>
              <p className='pb-2 label'>Set curency and pricing</p>
              <div className="flex gap-8 items-center">
                   <ReactSelect
                      name="curency"
                      options={[
                        {label:'USD',value:'USD'},
                        {label:'CAD',value:'CAD'},
                        {label:'EUR',value:'EUR'},
                        {label:'NGN',value:'NGN'},
                        {label:'AUD',value:'AUD'},
                      ]}
                      value={formData?.curency || ''}
                      onChange={handleSelect}
                      isClearable
                      placeholder="Select"
                      className="w-44 h-12"
                      setError={setErrors}
                      error={errors?.currency}
                    />
 
                  <CustomInput
                    name='amount'
                    value={formData?.amount || ''}
                    onChange={handleChange}
                    placeholder='Enter price'
                    className='w-40 z-50 '
                    error={errors?.amount }
                    type='number'
                    pattern="\d+"
                  />
              </div>
            </div>
          </>
          :null
        }

        {
          selectedType === 'multiple' ? 
          <CategoryForm
            formData={formData!}
            setFormData={setFormData!}
            errors={errors}
            setErrors={setErrors!}
          />
          :
          null
        }
    </div>
  );
};

export default AppointmentDetails;
