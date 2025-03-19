import React, { useState, useMemo } from 'react';
import { AppointmentUnavailability, Booking, FormattedUnavailability } from '@/types/appointments';
import { Trash } from 'lucide-react';
import { generateTimeOptions } from '../ui/DateTimeScheduler';
import {toast} from 'react-toastify';
import { format, parse, isValid } from 'date-fns';
import useUserStore from '@/store/globalUserStore';

const TimePicker = ({
  dayString,
  booking,
  handleUnavailabilityChange,
  unavailableForDay,
}: {
  dayString: string;
  booking: Booking;
  handleUnavailabilityChange: (dayString: string, newData: AppointmentUnavailability|null, deleteId?: number|bigint) => void; 
  unavailableForDay?: FormattedUnavailability[];
}) => {
  const { user,currentWorkSpace } = useUserStore();
  const [slot, setSlot] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const handleTimeChange = (field: 'from' | 'to', value: string) => {
    setSlot((prev) => ({ ...prev, [field]: value }));
    if (field === 'from') {
      setSlot((prev) => ({ ...prev, to: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!slot.from || !slot.to) {
      setError('Please fill out all time slots.');
      return;
    }

    const formData = {
      startDateTime: generateAppointmentTime({ time: slot.from, selectedDate: dayString }),
      endDateTime: generateAppointmentTime({ time: slot.to, selectedDate: dayString }),
      createdBy: user?.id!,
      appointmentDate: format(dayString, 'yyyy-MM-dd'),
      workspaceId : currentWorkSpace?.organizationAlias,
    };

    if (formData?.startDateTime! >= formData?.endDateTime!) {
      setError('Select an accurate time range.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/calendar/addunavailability?workspaceId=${currentWorkSpace?.organizationAlias}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([formData]),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form.');
      }

      const { data } = await response.json();
      toast.success('Form submitted');
      setSlot({ from: '', to: '' });
      handleUnavailabilityChange(dayString, data);
    } catch (error: any) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSlot = async (item: FormattedUnavailability) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/calendar/deleteUnavailability?id=${item?.id}&userId=${user?.id!}&workspaceId=${currentWorkSpace?.organizationAlias}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }

      toast.success('Deletion Successful');
      handleUnavailabilityChange(dayString, null, item?.id!); // Pass the id for deletion
    } catch (error: any) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border rounded-md border-zikoroBlue px-3 py-4 mb-4">
        <div className="bg-purple-100 rounded-md p-3 text-center mb-4">
          <h6 className="text-base font-medium">Edit unavailability</h6>
          <p className="text-sm">Add time when you will be unavailable today</p>
        </div>

        <div className="space-y-2 max-h-96 overflow-auto no-scrollbar">
          <div className="grid grid-cols-12 px-4 justify-center gap-3 items-center w-full">
              <div className="px-2 col-span-5 bg-purple-100  rounded">
                  <select
                  className="bg-transparent h-10 w-full flex justify-center items-center shrink-0 no-scrollbar focus:outline-none"
                  value={slot.from}
                  onChange={(e) => handleTimeChange('from', e.target.value)}
                  required
                >
                    <option value="" disabled className='disabled:text-slate-300'>Start time</option>
                    {timeOptions?.map((time: string, idx: number) => {
                      const exists = isTimeUnavailable(time,dayString,unavailableForDay!)
                      return (
                        <option key={idx} value={time} disabled={exists} className='disabled:text-slate-300'>{time}</option>
                      );
                    })}
                  </select>
              </div>

              <hr className=' border-gray-600'/>

                <div className="px-2 col-span-5 bg-purple-100  rounded">
                  <select
                    className="bg-transparent h-10  w-full flex justify-center items-center shrink-0 no-scrollbar focus:outline-none"
                    value={slot?.to}
                    onChange={(e) => handleTimeChange('to', e.target.value)}
                    required
                  >
                    <option value="" disabled className='disabled:text-slate-300'>End time</option>
                    {timeOptions.map((time: string, idx: number) => {
                      const exists = isTimeUnavailable(time,dayString,unavailableForDay!);
                      const lessThanStart = 
                          generateAppointmentTime({ time: time, selectedDate: format(dayString, 'yyyy-MM-dd') })! <=
                          generateAppointmentTime({ time: slot?.from, selectedDate: format(dayString, 'yyyy-MM-dd') })!
                      return (
                        <option key={idx} value={time} disabled={exists || lessThanStart } className='disabled:text-slate-300'>{time}</option>
                      );
                    })}
                  </select>
                </div>
            <Trash size={18}  className='opacity-0' />
          </div>

          {
            unavailableForDay?.map((slot, idx) => (
               (
                <div key={idx} className="  px-4 grid grid-cols-12  gap-3 items-center w-full">
                  <div className="flex h-10 col-span-5 justify-center items-center  bg-purple-100 rounded shrink-0">{slot?.from}</div>
                  <hr className='w-4 border-gray-700'/>
                  <div className="flex h-10 col-span-5 justify-center items-center  bg-purple-100 rounded shrink-0">{slot?.to}</div>
                  <Trash size={18} onClick={() => deleteSlot(slot)} />
                </div>
              )
            ))
          }

        </div>
        
        <p className="text-red-500 text-sm h-3 text-center w-full">{error}</p>
      </div>

      <div className="w-full">
        <button type="submit" className="bg-basePrimary rounded-md p-3 text-center w-full text-white">
          {loading ? 'Submitting...' : 'Apply'}
        </button>
      </div>
     
    </form>
  );
};

function generateAppointmentTime({ time, selectedDate }: { time: string; selectedDate: string }): string | null {
  if (!time) {
    return null;
  }
  // Format selectedDate to 'yyyy-MM-dd' if it's not already
  const formattedSelectedDate = format(new Date(selectedDate), 'yyyy-MM-dd');
  // Adjust the parsing format to match
  const appointmentDateTime = parse(`${formattedSelectedDate} ${time}`, 'yyyy-MM-dd hh:mm a', new Date());

  if (!isValid(appointmentDateTime)) {
    console.error("Invalid time format:", time);
    return null;
  }
  return format(appointmentDateTime, 'yyyy-MM-dd HH:mm:ss');
}

function isTimeUnavailable(
  time: string, // e.g., '2:00 AM'
  selectedDate: string, // e.g., 'Tue Oct 15 2024'
  unAvailableDates: FormattedUnavailability[] // List of unavailable times
): boolean {
  // Create a Date object for the selected date
  const baseDate = new Date(selectedDate);
  
  // Parse the input time into a Date object
  const inputTime = new Date(`${baseDate.toDateString()} ${time}`);

  // Check against each unavailability
  for (const unavailability of unAvailableDates) {
    // Create Date objects for the 'from' and 'to' times
    const fromTime = new Date(`${unavailability.appointmentDate} ${unavailability.from}`);
    const toTime = new Date(`${unavailability.appointmentDate} ${unavailability.to}`);

    // Check if the input time is within the unavailable interval
    if (inputTime >= fromTime && inputTime <= toTime) {
      return true; // The time is unavailable
    }
  }

  return false; // The time is available
}

export default TimePicker;

