import { AppointmentUnavailability, Booking, FormattedUnavailability } from '@/types/appointments';
import { MoveUpRight, XCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import TimePicker from './TimePicker';

const Action = ({
  appointment,
  list,
  dayString,
  unavailableForDay,
  handleUnavailabilityChange,
}: {
  appointment: Booking;
  list: Booking[];
  dayString: string;
  unavailableForDay?: FormattedUnavailability[];
  handleUnavailabilityChange: (dayString: string, newData: AppointmentUnavailability|null, deleteId?: number|bigint) => void; 
}) => {
  const [isOpen, setIsOpen] = useState<string>('');

  return (
    <React.Fragment>
      <div className="absolute inset-0 z-40 flex h-full flex-col gap-2 justify-center text-center p-2 pt-6">
        {list.length ? (
          <>
            <div className="flex justify-center">
              <Link
                href={`/workspace/appointments#${appointment?.appointmentDate}?date=${appointment?.appointmentDate}&dt=${appointment?.appointmentTime}`}
                className="bg-zikoroBlue flex-nowrap overflow-hidden text-[10px] xl:text-sm text-white flex items-center px-2 py-1 rounded-full justify-center gap-1"
              >
                <p className="shrink-0 flex-nowrap">View appointments</p>
                <MoveUpRight size={14} />
              </Link>
            </div>
          </>
        ) : (
          <p>No appointments available</p>
        )}

        <button onClick={() => setIsOpen(dayString)} className="underline text-sm">
          Set unavailability
        </button>
      </div>

      <div
        className={`${isOpen === dayString ? 'visible z-50 ' : 'hidden '} transform transition-all duration-300 ease-in-out fixed inset-0 bg-black/5 flex justify-center items-center p-2 sm:p-6`}
        onClick={() => setIsOpen('')}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" max-w-lg px-3 sm:px-6 py-12 flex flex-col items-center gap-4 bg-white shadow-xl rounded-md relative"
        >
          <XCircle size={20} onClick={() => setIsOpen('')} className="cursor-pointer absolute right-6 top-6 text-gray-600" />
          <h5 className="text-lg pb-4 font-semibold tex-center">{dayString}</h5>
          <TimePicker
            booking={appointment}
            dayString={dayString}
            handleUnavailabilityChange={handleUnavailabilityChange} // Pass the function down
            unavailableForDay={unavailableForDay}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Action;
