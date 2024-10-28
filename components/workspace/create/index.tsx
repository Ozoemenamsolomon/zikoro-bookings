'use client'

import { AtmCardIcon, BentArrowLeft, CalenderIcon, ClockIcon, SettingsIcon, ThemeIcon, urls } from '@/constants';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Details from './Details';
import SetAvailability from './SetAvailability';
import Payment from './Payment';
import AppointmentDetails from './AppointmentDetails';
import Branding from './Branding';
import Generalsettings from './Generalsettings';
import { AppointmentFormData, AppointmentLink, DetailItem } from '@/types/appointments';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { DaySchedule } from '../ui/DateTimeScheduler';
import SelectType from './SelectType';
import { uploadImage } from './uploadImage';
import { useAppointmentContext } from '@/context/AppointmentContext';
import useUserStore from '@/store/globalUserStore';
import Loading from '@/components/shared/Loader';
import { generateSlug } from '@/lib/generateSlug';

const detailsArray: DetailItem[] = [
  {
    title: 'Appointment Details',
    icon: <CalenderIcon />,
    description: 'Let guest know about your appointment',
    formComponent: AppointmentDetails,
  },
  {
    title: 'Payment',
    icon: <AtmCardIcon />,
    description: 'Enable settings to receive payment ',
    formComponent: Payment,
  },
  {
    title: 'Set Availability',
    icon: <ClockIcon />,
    description: 'Let guest know when you will be available',
    formComponent: SetAvailability,
  },
  {
    title: 'Branding',
    icon: <ThemeIcon />,
    description: 'Personalize your appointment page',
    formComponent: Branding,
  },
  {
    title: 'General Settings',
    icon: <SettingsIcon />,
    description: 'Additional Info for your appointment',
    formComponent: Generalsettings,
  },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ];
const formdata = {
  appointmentName: '',
  category: "",
  duration: null,
  loctionType: 'Onsite',
  locationDetails: '',
  timeZone: "",
  timeDetails: daysOfWeek.map(day => ({
    day,
    from: '',
    to: '',
    enabled: false
  })),
  curency: '',
  amount: null,
  paymentGateway: '',
  maxBooking: null,
  sessionBreak: null,
  statusOn: true,
  note: '',
  appointmentAlias: '',
  createdBy: null,
  businessName: null,
  logo: null,
  brandColour: '#0000FF',
  teamMembers: null,
  zikoroBranding: true,
  files: [],
  isPaidAppointment:false,
};

interface ValidationErrors {
  [key: string]: string;
}

const CreateAppointments: React.FC<{ appointment?: AppointmentLink, serverError?:string, alias?:string }> = ({ appointment,alias, serverError }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const {setselectedType,selectedType} = useAppointmentContext()
  const [isOpen, setIsOpen] = useState(appointment? false : true)

  const [formData, setFormData] = useState<AppointmentFormData>(formdata);
  const [errors, setErrors] = useState<{ [key: string]: string } | any>(serverError ? {'general': serverError} : null);
  const [loading, setLoading] = useState<boolean>(false);

  const {user} = useUserStore()
  useEffect(() => {
    if (appointment) {
      try {
        // Parse timeDetails and category
        const parsedTimeDetails = JSON.parse(appointment.timeDetails || "[]") as DaySchedule[];
        const parsedCategory = JSON.parse(appointment.category || `""`) as string | any[];

         // Update formData with parsed values
         setFormData({ 
          ...appointment, 
          timeDetails: parsedTimeDetails, category: parsedCategory, 
          isPaidAppointment: appointment.amount ? true : false 
        });
  
        // Check if parsedCategory is an array and set isOpen
        if (Array.isArray(parsedCategory)) {
          setselectedType('multiple')
        } else {
          setselectedType('single')
        }
  
        // Debugging output
        // console.log({ parsedCategory, parsedTimeDetails, formData });
      } catch (error) {
        console.error('Error parsing appointment details:', error);
      } finally {
        setLoading(false)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        createdBy: user?.id,
        // when creating new item and it is multiple 
        category: selectedType==='multiple' ? [] : ''
      }));
    }
  }, [appointment,pathname,selectedType]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    let newErrors = { ...errors };
    if(name==='loctionType'){
      delete newErrors['locationDetails']
    }
    delete newErrors[name];
    delete newErrors['general'];

    setErrors(newErrors);
  };

  const validate = (data: AppointmentFormData): boolean => {
    const error: ValidationErrors = {};

    if (!formData.appointmentName) {
      error.appointmentName = 'Appointment Name is required';
    }

    if (data.duration === null || data.duration <= 0 || data.duration % 5 !== 0 || !/^\d+$/.test(data?.duration.toString())) {
      error.duration = 'Duration must be a positive multiple of 5';
    }

    if (!data.loctionType) {
      error.loctionType = 'Location Type is required';
    }

    if (!data.locationDetails) {
      error.locationDetails = 'Location Details are required';
    }

    if (!data.timeZone) {
      error.timeZone = 'Time Zone is required';
    }

    if (!data.timeDetails) {
      error.timeDetails = 'Time Details are required';
    }

    if (data?.maxBooking === null || data?.maxBooking <= 0 || !/^\d+$/.test(data?.maxBooking.toString())) {
      error.maxBooking = 'Max Booking must be a positive number';
    }
    
    if (data?.sessionBreak === null || data?.sessionBreak < 0 || !/^\d+$/.test(data.sessionBreak.toString())) {
      error.sessionBreak = 'Session Break is required';
    }

    if (data.isPaidAppointment && data?.amount && data?.amount <= 0  ) {
      error.amount = 'Amount is required';
    }

    if (data.isPaidAppointment && !data.curency ) {
      error.curency = 'Currency is required';
    }

    if (data.isPaidAppointment && !data.paymentGateway) {
      error.paymentGateway = 'Payment gateway is required';
    }
    setErrors(error);
    return Object.keys(error).length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    if (validate(formData)) {
      setLoading(false);
      return;
    }
    const logoUrl = await uploadImage(formData.files!)
    delete formData['files']
    delete formData['isPaidAppointment']
    try {
      const payload = { 
        ...formData, 
        appointmentAlias: generateSlug(formData.appointmentName),
        timeDetails: JSON.stringify(formData.timeDetails), 
        category: JSON.stringify(formData.category), 
        logo: logoUrl || '', 
      };
      let response;
// console.log({formData,payload})
      let success='New appointment schedule created';
      if (appointment) {
        response = await fetch('/api/schedules/edit', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        success='Appointment schedule was eddited'
      } else {
        response = await fetch('/api/schedules/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
      const result = await response.json();

      if (response.ok) {
        setFormData(formdata);
        toast.success(success);
        push(urls.schedule);
      } else {
        setErrors({ general: result.error });
        toast.error('Form submission failed!');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

console.log({errors, formData})
  return (
    <main className="py-4 sm:p-8 z-50 relative bg-[#F9FAFF] ">
      <SelectType onClose={()=>setIsOpen(false)} isOpen={isOpen}/>

      {loading ?
        <div className="fixed z-50 bg-white/5 inset-0 flex justify-center items-center" ><Loading/></div>:null
      }

      <Link href={urls.schedule} type="button" className="max-sm:pl-4">
        <BentArrowLeft w={20} />
      </Link>
      <section className="py-4 flex w-full justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-[6px] p-6 sm:p-[60px] grid gap-0.5 overflow-hidden">
          {errors && Object.keys(errors).length > 0 && (
            <div className='grid overflow-hidden -96'>
              {errors.general ? (
                <div className="flex flex-wrap">
                  <p className="text-red-600 text-[12px] text-wrap">{errors.general}</p>
                </div>
              ) : (
                <div className="flex flex-wrap">
                  <p className="text-red-600 text-[12px] text-wrap">
                    {Object.values(errors).filter(error => error).join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}


          {detailsArray.map((detail, index) => {
            const FormComponent = detail.formComponent;
            return (
              <Details
                key={index}
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                setLoading={setLoading}
                title={detail.title}
                icon={detail.icon}
                description={detail.description}
                formComponent={
                  <FormComponent
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    loading={loading}
                    setLoading={setLoading}
                    handleChange={handleChange}
                  />
                }
              />
            );
          })}
          <div onClick={handleSubmit}
            className="mt-6 py-3 text-center w-full rounded-md text-[#F2F2F2] font-semibold text-xl bg-basePrimary cursor-pointer"
          >
            {loading ? 'Submitting...' : pathname.includes('edit') ? 'Edit Appointment' : 'Create Appointment'}
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateAppointments;
