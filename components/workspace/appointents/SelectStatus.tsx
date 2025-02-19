import { AppointmentStatuses, Box, TickedBox } from '@/constants'
import React, { Dispatch, SetStateAction, useState } from 'react'
import SelectCheckIn from './SelectCheckIn';
import { ChevronDown } from 'lucide-react';
import { Booking } from '@/types/appointments';
import { PostRequest } from '@/utils/api';
import { toast } from 'react-toastify';
import { formatTime, formatTimeSafely } from '@/lib/formatTime';
import { GroupedBookings } from '@/lib/server/appointments';

const SelectStatus = ({booking, setGroupedBookings}:{
booking:Booking,
setGroupedBookings: Dispatch<SetStateAction<GroupedBookings | null>>

}) => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>('IN ATTENDANCE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleClick = (selected:string) => {
      setSelectedStatus(selected)
    }

    const [timeData, setTimeData] = useState({
      checkIn: formatTimeSafely(booking.checkIn)||'',
      checkOut: formatTimeSafely(booking.checkOut)||'',
    })

    const updateCheckinTime = async () => {
      try {
        setIsSubmitting(true);
    
        const formattedCheckIn = formatTime(timeData.checkIn);
        const formattedCheckOut = formatTime(timeData.checkOut);
    
        if (!formattedCheckIn || !formattedCheckOut) {
          toast.error("Invalid time format.");
          return;
        }
    
        const { data, error } = await PostRequest<{ data: Booking | null; error: string | null }>({
          url: "/api/appointments/update",
          body: {
            checkIn: formattedCheckIn,  
            checkOut: formattedCheckOut,
            id: booking.id,
          },
        });
    
        if (data) {
          setGroupedBookings((prev) => {
            if (!booking.appointmentDate) return prev; // Ensure appointmentDate exists
    
            const dateKey =
              typeof booking.appointmentDate === "string"
                ? booking.appointmentDate
                : booking.appointmentDate.toISOString().split("T")[0];
    
            return {
              ...prev,
              [dateKey]: prev?.[dateKey]?.map((b) =>
                b.id === booking.id
                  ? { ...b, checkIn: formattedCheckIn, checkOut: formattedCheckOut }
                  : b
              ) || [],
            };
          });
    
          toast.success("Updated successfully");
        } else {
          toast.error(error || "Failed to update");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to update appointment");
      } finally {
        setIsSubmitting(false);
      }
    };
    
  return (
      <div className="text-center flex flex-col gap-6 justify-center">
        <h6 className="text-sm text-gray-600">
            Update booking status  of this contact
        </h6>

        <button onClick={()=>setSelectedStatus('Select status')} className=" py-4 border-b border-gray-500 w-52 text-center mx-auto flex gap-6 justify-center items-center ">
          <p className={selectedStatus==='Select status'?'text-gray-500':"text-zikoroBlue"}>{selectedStatus}</p>
          <ChevronDown size={20}  />
        </button>

        <div className="flex flex-col items-center justify-center">
          {
            selectedStatus === 'IN ATTENDANCE' ?
            <SelectCheckIn timeData={timeData} setTimeData={setTimeData} />
            :
            <div className=" space-y-3">
                  {AppointmentStatuses.map(({label,value}, i) => (
                    <button
                      key={i}
                      
                      className={`flex hover:font-semibold duration-300 items-center gap-3 w- `}
                      onClick={() => handleClick(value)}
                    >
                      <span>
                        {
                        selectedStatus === value ? 
                          <TickedBox />
                          :
                          <Box/>
                        }
                      </span>
                      {label}
                    </button>
                  ))}
            </div>
          }
        </div>
        <div className="flex justify-center">
          <button 
            onClick={updateCheckinTime} 
            className="bg-basePrimary text-white font-semibold text-sm px-6 py-3 rounded-md">
              {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
    </div>
  )
}

export default SelectStatus