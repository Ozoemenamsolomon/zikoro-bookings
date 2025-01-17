import { CustomerIon, RevenueIcon } from '@/constants';
import React, { useMemo } from 'react';
import { LongArrowUp, LongArrowDown } from 'styled-icons/fa-solid'; 
import { SectionOneProps } from './SectionOne';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { Booking } from '@/types/appointments';
import { getTypeLabel } from '@/lib/client/bookingsAnalytics';

const TotalCustomers: React.FC<SectionOneProps> = ({
  isLoading,
  type,
  error,
  current,
  previous,
}) => {
  // Function to extract unique customers
  const extractUniqueCustomers = (bookings: Booking[]) => {
    const customersSet = new Set(bookings.map((booking) => booking.participantEmail));
    return customersSet.size;
  };

  // Memoized values for performance
  const { totalCustomers, newCustomers, totalCurrentCustomers } = useMemo(() => {
    const totalCurrent = extractUniqueCustomers(current);
    const totalPrev = extractUniqueCustomers(previous);
    const totalCombined = extractUniqueCustomers([...current, ...previous]);
// console.log({totalCombined,totalPrev,totalCurrent,cur:current[0]})
    return { 
      totalCustomers: totalCombined,
      newCustomers: totalCurrent - totalPrev,
      totalCurrentCustomers: totalCurrent
    };
  }, [current, previous]);

  // Determine arrow icon, color, and text
  const { ArrowIcon, arrowColor, newCustomersText } = useMemo(() => {
    const isIncrease = newCustomers > 0;

    return {
      ArrowIcon: isIncrease ? LongArrowUp : LongArrowDown,
      arrowColor: isIncrease ? 'text-green-500' : 'text-red-500',
      newCustomersText: `${isIncrease ? '+' : ''}${Math.abs(newCustomers)}`,
    };
  }, [newCustomers]);

  return (
    <>
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className='border bg-[#F9FAFF] p-4 rounded-md flex flex-col justify-center items-center gap-2'>
          <CustomerIon />

          <h5 className="text-lg">Total Customers</h5>

          <h3 className="text-2xl font-bold">{totalCurrentCustomers}</h3>

          <div className="flex justify-center items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowIcon size={12} className={arrowColor} />
              <p className={`text-lg ${arrowColor}`}>{newCustomersText}</p>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-600 shrink-0"></div>
            <p className="text-gray-600">
              from last {getTypeLabel(type)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalCustomers;
