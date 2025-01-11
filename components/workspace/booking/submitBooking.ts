import { format, parse } from "date-fns";
import { AppointmentLink, Booking, BookingsContact } from "@/types/appointments";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type ValidateFunction = () => boolean;

interface SubmitBookingProps {
    setLoading: SetState<boolean>;
    setErrors: SetState<Record<string, string>>;
    validate?: ValidateFunction;
    bookingFormData: Booking | null;
    setBookingFormData: SetState<Booking| null>;
    slotCounts: Record<string, number>| null
    setSlotCounts: SetState<Record<string, number>| null>;
    setInactiveSlots: SetState<string[]>;
    setSuccess: SetState<string>;
    maxBookingLimit: number;
    appointmentLink:AppointmentLink|null;
    insertBookingsContact:( (contact: BookingsContact) => void) | null
    setShow: React.Dispatch<React.SetStateAction<string>>;
    setIsFormUp: (type:string)=>void
}

export const submitBooking = async ({
    setLoading,
    setErrors,
    bookingFormData,
    setBookingFormData,
    slotCounts,
    setSlotCounts,
    setInactiveSlots,
    setSuccess,
    maxBookingLimit,
    appointmentLink,
    insertBookingsContact,
    setShow, setIsFormUp,
}: SubmitBookingProps): Promise<{ bookingSuccess?: boolean; emailSuccess?: boolean }> => {

    setLoading(true);
    setErrors({});
    setSuccess('')

    let bookingSuccess=false, emailSuccess=false

    const timeStamp = generateAppointmentTime({
        timeRange: bookingFormData?.appointmentTime!,
        selectedDate: bookingFormData?.appointmentDate!
    });

    let newBookingData = {
        ...bookingFormData,
        // appointmentTime: '' ,
        appointmentTime: timeStamp ,
        appointmentNotes: {categoryNote: bookingFormData?.categoryNote}
    }

    delete newBookingData?.['categoryNote']
// console.log({newBookingData})
    try {
        const response = await fetch('/api/bookings/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBookingData),
        });
        
        const result = await response.json();
// console.log({result})
       
        if (response.ok) {
            bookingSuccess=true
            setBookingFormData((prevData: Booking| null) => ({
                ...prevData!,
                appointmentTime: null,
            }));

            // insert contact
            let newContact:BookingsContact = {
                email: bookingFormData?.participantEmail,
                phone: bookingFormData?.phone,
                whatsapp: '',
                firstName: bookingFormData?.firstName,
                lastName: bookingFormData?.lastName,
                createdBy: appointmentLink?.createdBy?.id,
            } 
            insertBookingsContact && await insertBookingsContact(newContact)

            // send email
            const res  = await fetch('/api/email/send-bookings-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingFormData: newBookingData,
                    appointmentLink,
                }),
            });
            // console.log({email: await res.json()})
            setSuccess('Booking was successful')
            if(res.ok){
                emailSuccess=true
                console.log('==GOOD RES==')
                
                // setSuccess('Booking was successful, email reminder sent')
            } else {
                console.log('==BAD RES==')
                // setSuccess(`Booking successful, some emails could not send`)
            }
            const slot: string = result?.data?.appointmentTime;
            // update slot booking count
            const newSlotCounts = { ...slotCounts };
            newSlotCounts[slot] = (newSlotCounts[slot] || 0) + 1;
            setSlotCounts(newSlotCounts);

            if (newSlotCounts[slot] >= maxBookingLimit) {
                setInactiveSlots((prev: string[]) => ([...prev, slot]));
            }

            // Popup final stage for contact page booking
            !insertBookingsContact && setShow('final')
        } else {
            console.error('Form submission failed', result);
            // setErrors({ general: 'An unexpected error occurred, Try again' });
                setErrors({ general: result.error });
        }
    } catch (error) {
        console.error('An error occurred:', error);
        setErrors({ general: 'An unexpected error occurred' });
        return {bookingSuccess, emailSuccess}
    } finally {
        setLoading(false);
    }
    return {bookingSuccess, emailSuccess}
};

interface BookingInput {
    timeRange: string;
    selectedDate: Date | string | null;
  }

export function generateAppointmentTime({ timeRange, selectedDate }: BookingInput): string | null {
    if (!timeRange) {
      return null;
    }
    const [startTime] = timeRange.split(' - ');
    
    const appointmentDateTime = parse(startTime, 'hh:mm a', new Date(selectedDate || Date.now()));
    console.error({timeRange, selectedDate, appointmentDateTime});
  
    if (isNaN(appointmentDateTime.getTime())) {
      console.error("Invalid startTime format:", startTime);
      return null;
    }
    return format(appointmentDateTime, 'HH:mm:ss');
  }
  