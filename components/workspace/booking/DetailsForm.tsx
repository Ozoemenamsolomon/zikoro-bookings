import React, {  useEffect, useState } from 'react';
import { AppointmentLink,  } from '@/types/appointments';
import { CheckCircle, XCircle } from 'lucide-react';
import { submitBooking } from './submitBooking';
import { useAppointmentContext } from '@/context/AppointmentContext';
import CustomInput from '../ui/CustomInput';
import { useBookingsContact } from '@/hooks/services/appointments';
import { usePathname } from 'next/navigation';
import MessageModal from '@/components/shared/MessageModal';

const DetailsForm = ({appointmentLink}:{appointmentLink:AppointmentLink | null}) => {
  const pathname = usePathname()

  const {bookingFormData, contact, isFormUp, setIsFormUp, setBookingFormData, slotCounts, setSlotCounts,setInactiveSlots,setShow} = useAppointmentContext()
  const {insertBookingsContact} = useBookingsContact()

  // update form state with contact, if it is contact page
  const isContactPage = pathname.includes('contacts')

  const maxBookingLimit = appointmentLink?.maxBooking!;

  useEffect(() => {
    setBookingFormData({
        ...bookingFormData!,
        appointmentLinkId: appointmentLink?.id,
        // currency: appointmentLink?.curency,
        // price: appointmentLink?.amount,
        bookingStatus: '',
        appointmentName: appointmentLink?.appointmentName,
        teamMembers: appointmentLink?.teamMembers,
        // appointmentType: appointmentLink?.category,
        scheduleColour: appointmentLink?.brandColour,
        feeType: appointmentLink?.isPaidAppointment ? 'Paid appointment' : 'Free',
        firstName: isContactPage ? contact?.firstName || '' : '',
        lastName:isContactPage ? contact?.lastName || '' : '',
        phone:isContactPage ? contact?.phone || '' : '',
        participantEmail: isContactPage ? contact?.email || '' : '',
    })
  }, [])
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDisabled = !bookingFormData?.appointmentDate || !bookingFormData?.appointmentTime || !bookingFormData?.appointmentLinkId || !bookingFormData?.participantEmail;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setBookingFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validate = (): boolean => {
    const error: Record<string, string> = {};
    if (!bookingFormData?.firstName) {
      error.firstName = 'First name is required';
    }
    if (!bookingFormData?.lastName) {
      error.lastName = 'Last name is required';
    }
    // if (!bookingFormData?.notes) {
    //   error.notes = 'Add a note';
    // }
    if (!bookingFormData?.participantEmail) {
      error.participantEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingFormData?.participantEmail)) {
      error.participantEmail = 'Email is invalid';
    }
    if (!bookingFormData?.phone) {
      error.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(bookingFormData?.phone.toString())) {
      error.phone = 'Phone number is invalid';
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await submitBooking({
      setLoading,
      setErrors,
      validate,
      bookingFormData,
      setBookingFormData,
      slotCounts,
      setSlotCounts,
      setInactiveSlots,
      maxBookingLimit,
      setSuccess,
      appointmentLink,
      // do not insert contact in contact page
      insertBookingsContact:  isContactPage ? null : insertBookingsContact,
      setShow,
      setIsFormUp,
    });
  };
// console.log({price:bookingFormData})
  return (
    <div className= {`${isFormUp ? ' visible translate-x-0':' -translate-x-full '} transform transition-all duration-300 w-full relative flex flex-col bg-white h-full px-6 py-10 rounded-lg shadow-md  justify-center items-center` } >
        {
           success && 
           <MessageModal onClose={()=>{
            setSuccess('')
            setIsFormUp('')
           }}>
               <CheckCircle className='text-blue-600' size={48} />
               <p className="text-blue-60">{success}</p>
           </MessageModal> 
        }
        {
           errors?.general &&
           <MessageModal onClose={()=>{
            setErrors({})
            // setIsFormUp('')
           }}>
               <XCircle size={48} className='text-red-600' />
               <p className="text-red-60">{'Unexpected error occured. Try again'}</p>
               {/* <small className="text-red-60">{errors?.general}</small> */}
           </MessageModal> 
        }
        <p className="pb-6 text-lg font-semibold">Enter your details</p>

        <div className="mx-auto w-full max-w-2xl space-y-4" >
          <div className="grid sm:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-2 justify-between h-full w-full">
                  <div className="">
                    <CustomInput
                      label="First Name"
                      type="text"
                      error={errors?.firstName || ''}
                      name="firstName"
                      value={bookingFormData?.firstName || ''}
                      placeholder="Enter your first name"
                      disabled={isContactPage}
                      className="py-2.5 w-full disabled:opacity-50"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="">
                    <CustomInput
                      label="Last Name"
                      type="text"
                      error={errors?.lastName || ''}
                      name="lastName"
                      value={bookingFormData?.lastName || ''}
                      placeholder="Enter your last name"
                      disabled={isContactPage}
                      className="py-2.5  w-full disabled:opacity-50"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="">
                    <CustomInput
                      label="Email"
                      type="email"
                      error={errors?.participantEmail || ''}
                      name="participantEmail"
                      value={bookingFormData?.participantEmail || ''}
                      placeholder="Enter your email"
                      disabled={isContactPage}
                      className="py-2.5  w-full disabled:opacity-50"                    
                      onChange={handleChange}
                    />
                  </div>
                  <div className="">
                    <CustomInput
                      label="Phone"
                      type="tel"
                      error={errors?.phone || ''}
                      name="phone"
                      value={bookingFormData?.phone || ''}
                      placeholder="Enter your phone number"
                      disabled={isContactPage}
                      className="py-2.5  w-full disabled:opacity-50"
                      onChange={handleChange}
                    />
                  </div>
              </div>

              <div className="flex flex-col w-full h-full">
                  <p className='pb-1 text-sm flex-1 shrink-0 text-nowrap'> Add a note to this appointment</p>
                  <textarea 
                    name="notes" id="notes"
                    onChange={handleChange}
                    value={bookingFormData?.notes || ''}
                    required
                    className={`${errors.notes ? 'ring-2 ring-red-600':''} sm:h-full  w-full focus:outline-none  p-3 h-32 border  rounded-xl `}
                    >
                  </textarea>
              </div>
          </div>

          <XCircle onClick={()=>setIsFormUp('')} size={20} className='text-gray-500 cursor-pointer absolute top-6 right-6'/>

          <div className="w-full">
            { 
            // TODO: confirm if host should complete booking without payment
              bookingFormData?.price && !isContactPage ?
              // process for paid appointments
              <button
                onClick={()=>{
                  setIsFormUp('pay') 
                  // setBookingFormData({
                  //   ...bookingFormData,
                  //   price:appointmnetLink?.amount,
                  //   currency:appointmnetLink?.curency,
                  // })
                }}
                className={`w-full cursor-pointer py-2 px-4 bg-basePrimary text-white rounded ${loading  || isDisabled ? ' cursor-not-allowed opacity-30' : ''}`}
                disabled={loading || isDisabled}
              >
                Process and pay
              </button> 
              :
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={isDisabled}
                className={`w-full px-4 py-3 rounded-md text-center bg-basePrimary text-white ${loading || isDisabled  ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Book Appointment'}
              </button>
              }
          </div>
        </div>
    </div>
  );
};

export default DetailsForm;
