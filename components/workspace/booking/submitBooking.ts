import { format, parse } from "date-fns";
import { AppointmentLink, Booking, BookingReminder, BookingsContact } from "@/types/appointments";
import { getBookingSmsReminderMsg } from "@/lib/bookingReminders/templates";

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
    insertBookingsContact:( (contact: BookingsContact) => any) | null
    insertBookingsReminder:( (booking: Booking) => any) 
    setShow?: React.Dispatch<React.SetStateAction<string>>;
    // setIsFormUp: (type:string)=>void
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
    setShow,
    insertBookingsReminder,
  }: SubmitBookingProps): Promise<{ bookingSuccess?: boolean; emailSuccess?: boolean }> => {
    setLoading(true);
    setErrors({});
    setSuccess('');
  
    let bookingSuccess = false, emailSuccess = false;
  
    const timeStamp = generateAppointmentTime({
      timeRange: bookingFormData?.appointmentTime!,
      selectedDate: bookingFormData?.appointmentDate!
    });
  
    let newBookingData = {
      ...bookingFormData,
      appointmentTime: timeStamp,
      appointmentNotes: { categoryNote: bookingFormData?.categoryNote }
    };
  // console.log({appointmentLink, newBookingData})
    delete newBookingData['categoryNote'];
    try {
        
      // Build contact record
      const newContact: BookingsContact = {
        email: bookingFormData?.participantEmail,
        phone: bookingFormData?.phone,
        whatsapp: '',
        firstName: bookingFormData?.firstName,
        lastName: bookingFormData?.lastName,
        createdBy: appointmentLink?.createdBy?.id,
        workspaceId: appointmentLink?.workspaceId,
      };
  
      // Step 0: insert ontact // fetch contact if it aleady exist else insert new one. based on email and workspaceId.
      const data = insertBookingsContact && await insertBookingsContact(newContact)
      // Step 1: Insert booking
      const response = await fetch('/api/bookings/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({contactId:data.id??null, ...newBookingData}),
      });
  
      const result = await response.json();
      
      console.log({response,contact:data})
      
      if (!response.ok) {
        console.error('Form submission failed', result);
        setErrors({ general: result.error });
        return { bookingSuccess, emailSuccess };
      }
  
      bookingSuccess = true;
      setBookingFormData((prevData) => ({ ...prevData!, appointmentTime: null }));

      // Step 2: Run side effects concurrently
      const promises: Promise<any>[] = [
        appointmentLink?.smsNotification==='ON' && insertBookingsReminder({...result.data}), // Reminder is required
        fetch('/api/email/send-bookings-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingFormData: newBookingData, appointmentLink }),
        }),
        fetch('/api/sms/sendSms?type=bookingReminder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients: newBookingData.phone,
            message: getBookingSmsReminderMsg(result.data)
          }),
        }),
      ];
  
      const results = await Promise.allSettled(promises);
  
      // Step 3: Handle results
      const emailResult = insertBookingsContact ? results[1] : results[0];
      if (emailResult.status === 'fulfilled' && (emailResult.value?.ok ?? true)) {
        emailSuccess = true;
      }
  
      setSuccess('Booking was successful');
  
      const slot = result?.data?.appointmentTime;
      const newSlotCounts = { ...slotCounts };
      newSlotCounts[slot] = (newSlotCounts[slot] || 0) + 1;
      setSlotCounts(newSlotCounts);
  
      if (newSlotCounts[slot] >= maxBookingLimit) {
        setInactiveSlots((prev) => [...prev, slot]);
      }
  
      if (!insertBookingsContact && setShow) {
        setShow('final');
      }
  
    } catch (error) {
      console.error('An error occurred:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  
    return { bookingSuccess, emailSuccess };
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
    // console.error({timeRange, selectedDate, appointmentDateTime});
  
    if (isNaN(appointmentDateTime.getTime())) {
    //   console.error("Invalid startTime format:", startTime);
      return null;
    }
    return format(appointmentDateTime, 'HH:mm:ss');
  }
  