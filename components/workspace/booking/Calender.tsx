'use client'

import { AppointmentLink } from '@/types/appointments'
import React , { useEffect, useState } from 'react'
import Slots from './Slots'

import {
	add,
	eachDayOfInterval,
	endOfMonth,
	format,
	getDay,
	isEqual,
	isSameMonth,
	isToday,
	parse,addMinutes,
	isBefore,
	startOfToday,startOfDay,  addDays, 
} from 'date-fns';
import {  ChevronLeft, ChevronRight } from 'lucide-react'
import DetailsForm from './DetailsForm'
import { Category } from '../create/CategoryForm'
import SelectOnly from '../ui/SeectInput'
import { useAppointmentContext } from '@/context/AppointmentContext';
import { BookingSlotSkeleton } from '@/components/shared/Loader';


function classNames(...classes: (string | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
// export interface TimeDetail {
//     day: string;
//     from: string;
//     to: string;
//     enabled: boolean;
// }
// interface Slot {
//     label: string;
//     value: string;
//   }
// export interface SlotsResult {
// selectDay: string;
// slots: Slot[];
// }

export interface TimeDetail {
  day: string;
  from: string;
  to: string;
  enabled?: boolean; // Optional for flexibility in handling disabled days
}

interface Slot {
  label: string;
  value: string;
}

export interface SlotsResult {
  selectDay: string;
  slots: Slot[];
}

interface CalendarProps {
  appointmentLink: AppointmentLink | null;
}

  
const Calender: React.FC<CalendarProps> = ({ appointmentLink, }) => {
    const [slotsLoading, setSlotsLoading] = useState(true)
    const [hasCategory, setHasCategory] = useState(false)
    const {bookingFormData, isFormUp, setIsFormUp, setBookingFormData} = useAppointmentContext()

    let today = startOfToday();

    let [selectedDay, setSelectedDay] = useState<Date>();
    let [timeSlots, setTimeSlots] = useState<SlotsResult | null >(null);

    function getEnabledTimeDetails(): TimeDetail[] {
        if (!appointmentLink || !appointmentLink.timeDetails) {
          return [];
        }
        try {
          const timeDetails: TimeDetail[] = JSON.parse(appointmentLink.timeDetails);
          const enabledItems: TimeDetail[] = timeDetails.filter(item => item.enabled);
          return enabledItems;
        } catch (error) {
          console.error('Failed to parse timeDetails:', error);
          return [];
        }
      }

    // Determine disabled days from the appointmentLink/timeDetails
    const isDayDisabled = (day: Date): boolean => {
        const enabledDays = getEnabledTimeDetails()
        const dayOfWeek = new Date(day).getDay();
        const daysMap: { [key: number]: string } = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };

		// Disable days before today
		const startOfDayToCheck = startOfDay(day);
		if (isBefore(startOfDayToCheck, startOfToday())) {
			return true
		}
        // Check if the day is enabled
        const dayName = daysMap[dayOfWeek];
        const isDayEnabled = enabledDays.some(item => item.day === dayName && item.enabled);

        return !isDayEnabled;
	  };

    // mount booked slots for the selected date
    useEffect(() => {
        if(!selectedDay && appointmentLink){
            const nextAvailableDay = findNextAvailableDay(appointmentLink?.timeDetails);
            const nextAvailableDate = new Date(nextAvailableDay.date);
            setSelectedDay(nextAvailableDate);
        } else if(selectedDay) {
            const selectedTimeSlots = generateSlots(
                getEnabledTimeDetails(), appointmentLink?.duration!, appointmentLink?.sessionBreak||0, selectedDay)
                // console.log({selectedTimeSlots, timeDetails:getEnabledTimeDetails()})

                setTimeSlots(selectedTimeSlots)
                setSlotsLoading(false)
        }
    }, [selectedDay, appointmentLink]);

  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
	let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

	let days = eachDayOfInterval({
		start: firstDayCurrentMonth,
		end: endOfMonth(firstDayCurrentMonth),
	});

	function previousMonth() {
		let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
		setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
	}

	function nextMonth() {
		let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
		setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
	}

  const normalizedSelectedDay = startOfDay(selectedDay!);

  const appointmentTypeJson: Category[] = JSON.parse(appointmentLink?.category || `[]`);
// console.log({appointmentTypeJson, checking:appointmentLink?.category})
  const appointmentTypes: { label: string, value: string }[] = appointmentTypeJson ?
    appointmentTypeJson.map((item: Category) => ({
      label: item.name || '',
      value: item.name || '',
    }))
    : [];

    useEffect(() => {
      if(!bookingFormData?.appointmentType){
        const selectedAppointmentType = Array.isArray(appointmentTypeJson) && appointmentTypeJson.find((item: Category) => item.name === bookingFormData?.appointmentType) || appointmentTypeJson[0];
        setBookingFormData((prev) => ({
          ...prev,
          appointmentType: appointmentTypeJson[0]?.name || '',
          price: selectedAppointmentType?.amount || appointmentLink?.amount,
          currency: selectedAppointmentType?.curency || appointmentLink?.curency || '',
          categoryNote: selectedAppointmentType?.note,
        }));
      } else {
        if (Array.isArray(appointmentTypeJson) && appointmentTypeJson.length) {
          const selectedAppointmentType = appointmentTypeJson.find((item: Category) => item.name === bookingFormData?.appointmentType) || appointmentTypeJson[0];
          setBookingFormData((prev) => ({
            ...prev,
            price: selectedAppointmentType?.amount,
            currency: selectedAppointmentType?.curency,
            categoryNote: selectedAppointmentType?.note,
          }));
        }
        // console.log('bbbbbbb', {bookingFormData, appointmentTypeJson})
      }

      setHasCategory(Array.isArray(appointmentTypeJson) && appointmentTypeJson.length > 0)
    // Add `appointmentTypeJson` and `bookingFormData.appointmentType` as dependencies to avoid infinite loops
  }, [ bookingFormData?.appointmentType]);

  return (
    <>
    {
       
        isFormUp==='details' ?
        <DetailsForm appointmentLink={appointmentLink}/>
        :
        <div className="w-full max-md:pb-4 rounded-lg bg-white shadow  max-sm:space-y-6 sm:flex md:max-h-[30rem] 2xl:max-h-[33rem]">
            <div className=" bg-white   sm:w-3/5 p-4 rounded-lg  flex-shrink-0 ">

                {appointmentLink?.category && Array.isArray(appointmentTypeJson) && appointmentTypeJson.length ? 
                <div className="w-full pb-6 px-4 space-y-1 flex flex-col justify-center items-center">
                    <h5  className='font-semibold text- '>Select meeting category</h5  >
                    <SelectOnly
                        name='appointmentType'
                        value={bookingFormData?.appointmentType || ''}
                        options={appointmentTypes}
                        setFormData={setBookingFormData}
                        className='w-72 z-30'
                    />
                </div> : null}

                <p className='pb-1 font-semibold text-'>Select day</p>

                <div className="  border rounded-lg  py-6  ">
                    <div className="flex  items-center w-full justify-between gap-4 px-4">
                        <div>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className=" p-1.5 text-gray-400 hover:text-gray-600">
                                {/* <span className="">Previous month</span> */}
                                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                        <h5 className=" ">
                            {format(firstDayCurrentMonth, 'MMMM yyyy')}
                        </h5>
                        <div>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className=" p-1.5 text-gray-400 hover:text-gray-600">
                                {/* <span className="">Next month</span> */}
                                <ChevronRight className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className=" grid grid-cols-7 mt-6 text-xs leading-6 text-center text-gray-500">
                        <div>S</div>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                    </div>

                    <div className="grid grid-cols-7 mt-2 text-sm">
                        {days.map((day, dayIdx) => {
                            const normalizedDay = startOfDay(day);
                            return <div
                                key={day.toString()}
                                className={classNames(
                                    dayIdx === 0 && colStartClasses[getDay(day)],
                                    'py-1.5 lg:p-2',
                                )}>
                                <button
                                    type="button"
                                    disabled={isDayDisabled(day)}
                                    onClick={() => {
                                        setSelectedDay(day)
                                        setBookingFormData({
                                            ...bookingFormData,
                                            appointmentDate: format(day, 'yyyy-MM-dd'),
                                        })
                                    }}
                                    className={classNames(
                                        isEqual(normalizedDay, normalizedSelectedDay) && 'text-white',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                            isToday(normalizedDay) &&
                                            ' font-bold',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                            !isToday(normalizedDay) &&
                                            isSameMonth(normalizedDay, firstDayCurrentMonth) &&
                                            'text-gray-90',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                        !isSameMonth(normalizedDay, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                        
                                        // isEqual(day, selectedDay) && isToday(day) && 'bg-orange-500',
                                        isEqual((normalizedDay), normalizedSelectedDay)  && 'bg-zikoroBlue ',
                                        !isEqual(normalizedDay, normalizedSelectedDay) && 'hover:bg-gray-200',
                                        isDayDisabled(normalizedDay) && 'disabled text-gray-300 cursor-not-allowed',
                                        (isEqual(normalizedDay, normalizedSelectedDay) || isToday(normalizedDay)) &&
                                            'font-bold',
                                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full ',
                                    )}>
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                                        {format(day, 'd')}
                                    </time>
                                </button>
                            </div>
                        })}
                    </div>
                </div>
            </div>

            {
                slotsLoading ?
                <div className="bg-white p-4 rounded-lg w-full"><div className='px-4'>
                <h5 className=" pt-3 pb-2 font-semibold">Choose Time</h5>  
                <BookingSlotSkeleton/></div></div>
                :
                <Slots hasCategory={hasCategory} appointmentLink={appointmentLink} selectedDate={selectedDay} timeSlots={timeSlots} />
            }
        </div>
    }
    </>
    )
}

export default Calender


// Convert time in "HH:MM AM/PM" format to minutes since midnight
const convertTimeToMinutes = (time: string): number => {
  const [hoursMinutes, period] = time.split(' ');
  let [hours, minutes] = hoursMinutes.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

// Convert minutes since midnight to "HH:MM AM/PM" format
const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = mins < 10 ? `0${mins}` : mins;

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

// Format a time string to 'HH:mm:ss' using a selected date
const formatTimeString = (startTime: string, selectedDate: Date): string => {
  const parsedTime = parse(startTime, 'h:mm a', selectedDate);
  return format(parsedTime, 'HH:mm:ss');
};

// const parseTime = (time: string, baseDate: Date): Date =>
//   parse(time, 'h:mm a', baseDate);

// const addTime = (baseDate: Date, minutesToAdd: number): Date =>
//   addMinutes(baseDate, minutesToAdd);

// export const generateSlots = (
//   timeRanges: TimeDetail[],
//   duration: number,
//   sessionBreak: number,
//   selectedDay: Date
// ): SlotsResult | null => {
//   const slots: Slot[] = [];
//   const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const dayName = daysOfTheWeek[selectedDay.getDay()];

//   // Match the time range for the selected day
//   const selectedRange = timeRanges.find(
//     (range) => range.day.toLowerCase() === dayName.toLowerCase() && range.enabled
//   );

//   if (!selectedRange) {
//     return null;
//   }

//   const startTime = parseTime(selectedRange.from, selectedDay);
//   const endTime = parseTime(selectedRange.to, selectedDay);
//   let currentTime = startTime;

//   while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
//     // Format current slot's start and end times
//     const slotStart = format(currentTime, 'h:mm a');
//     const slotEnd = format(addTime(currentTime, duration), 'h:mm a');

//     slots.push({
//       label: `${slotStart} - ${slotEnd}`,
//       value: format(currentTime, 'hh:mm a'),
//     });

//     // Increment by the total time of duration + break
//     currentTime = addTime(currentTime, duration + sessionBreak);
//   }

//   return {
//     selectDay: format(selectedDay, 'yyyy-MM-dd'),
//     slots,
//   };
// };

// const testingSlots = () => {
//   const selectedTimeSlots = generateSlots(
//     [
//       {
//         "day": "Monday",
//         "from": "08:00 AM",
//         "to": "07:00 PM",
//         "enabled": true
//       },
//       {
//         "day": "Tuesday",
//         "from": "08:30 AM",
//         "to": "02:30 PM",
//         "enabled": true
//       },
//       {
//         "day": "Wednesday",
//         "from": "",
//         "to": "",
//         "enabled": false
//       },
//       {
//         "day": "Thursday",
//         "from": "",
//         "to": "",
//         "enabled": false
//       },
//       {
//         "day": "Friday",
//         "from": "",
//         "to": "",
//         "enabled": false
//       },
//       {
//         "day": "Saturday",
//         "from": "",
//         "to": "",
//         "enabled": false
//       },
//       {
//         "day": "Sunday",
//         "from": "",
//         "to": "",
//         "enabled": false
//       }
//     ],
//     60, // Set valid duration (e.g., 60 minutes)
//     0,  // Session break, you can leave it at 0 if no break is needed
//     new Date("2024-12-09T00:00:00.000Z")
//   );
//   console.log({ selectedTimeSlots });
// };

// // Convert time in "HH:MM AM/PM" format to minutes since midnight
// const convertTimeToMinutes = (time: string): number => {
//   const [hoursMinutes, period] = time.split(' ');
//   let [hours, minutes] = hoursMinutes.split(':').map(Number);

//   if (period === 'PM' && hours !== 12) {
//     hours += 12;
//   }
//   if (period === 'AM' && hours === 12) {
//     hours = 0;
//   }

//   return hours * 60 + minutes;
// };

// // Convert minutes since midnight to "HH:MM AM/PM" format
// const convertMinutesToTime = (minutes: number): string => {
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   const period = hours >= 12 ? 'PM' : 'AM';

//   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
//   const formattedMinutes = mins < 10 ? `0${mins}` : mins;

//   return `${formattedHours}:${formattedMinutes} ${period}`;
// };

// // Format a time string to 'HH:mm:ss' using a selected date
// function formatTimeString(startTime: string, selectedDate: Date): string {
//   const parsedTime = parse(startTime, 'h:mm a', new Date(selectedDate));
//   const formattedTime = format(parsedTime, 'HH:mm:ss');
//   return formattedTime;
// }

// // Generate slots for a given day, time range, duration, and session break
export const generateSlots = (
  timeRanges: TimeDetail[],
  duration: number,
  sessionBreak: number,
  selectedDay: Date
): SlotsResult | null => {
  const slots: Slot[] = [];

  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = selectedDay && daysOfTheWeek[selectedDay.getDay()];

  const selectedRange = timeRanges.find(range => range.day.toLowerCase() === dayName.toLowerCase() && range.enabled);

  // if date/day is disabled, return empty slot
  if (!selectedRange) {
    return null;
  }

  const startMinutes = convertTimeToMinutes(selectedRange.from);
  const endMinutes = convertTimeToMinutes(selectedRange.to);
  let currentStart = startMinutes;

  while (currentStart + duration <= endMinutes) {
    const slotStart = convertMinutesToTime(currentStart);
    const slotEnd = convertMinutesToTime(currentStart + duration);

    const slotStartValue = formatTimeString(slotStart, selectedDay);

    slots.push({
      label: `${slotStart} - ${slotEnd}`,
      value: slotStartValue,
    });

    currentStart += duration + sessionBreak;
  }

  return {
    selectDay: format(selectedDay, 'yyyy-MM-dd'),
    slots,
  };
};

interface Schedule {
  day: string;
  from: string;
  to: string;
  enabled: boolean;
}

const findNextAvailableDay = (scheduleJson: string): Schedule & { date: string } => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const today = startOfToday();
  const todayDayOfWeek = getDay(today);

  const schedule: Schedule[] = JSON.parse(scheduleJson);

  // Check if today is enabled or find the next enabled day
  for (let i = 0; i < 7; i++) {
    const currentDayIndex = (todayDayOfWeek + i) % 7;
    const currentDay = daysOfWeek[currentDayIndex];

    const scheduleForCurrentDay = schedule.find(s => s.day === currentDay && s.enabled);

    if (scheduleForCurrentDay) {
      const nextDate = addDays(today, i);
      return { ...scheduleForCurrentDay, date: format(nextDate, 'yyyy-MM-dd') };
    }
  }

  // If no day is enabled, return the first available day in the schedule with the calculated date
  const firstEnabledDay = schedule.find(s => s.enabled) || schedule[0];
  const firstEnabledDayIndex = daysOfWeek.indexOf(firstEnabledDay.day);
  const daysUntilNextOccurrence = (firstEnabledDayIndex - todayDayOfWeek + 7) % 7;
  const nextDate = addDays(today, daysUntilNextOccurrence);

  return { ...firstEnabledDay, date: format(nextDate, 'yyyy-MM-dd') };
};

let colStartClasses = [
	'',
	'col-start-2',
	'col-start-3',
	'col-start-4',
	'col-start-5',
	'col-start-6',
	'col-start-7',
];