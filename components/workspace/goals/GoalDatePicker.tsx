'use client'

import { AppointmentLink } from '@/types/appointments'
import React , { useEffect, useState } from 'react'

import {
	add,
	eachDayOfInterval,
	endOfMonth,
	format,
	getDay,
	isEqual,
	isSameMonth,
	isToday,
	parse,
	isBefore,
	startOfToday,startOfDay,  addDays, 
} from 'date-fns';
import {  Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { DropMenu } from '@/components/shared/DropMenu';
import { Button } from '@/components/ui/button';
 
function classNames(...classes: (string | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
 
interface CalendarProps {
    label?:string,
    isDayDisabled:(day:Date)=>boolean,
    error?: string
    name: string
    value?: Date | string
    onChange: (date: Date | undefined, field?:string) => void
    disabled?: boolean
    isRequired?: boolean
    placeholder?: string
    className?: string
}
  
export const GoalDatePicker:React.FC<CalendarProps> = ({label,name,isRequired,isDayDisabled, disabled, placeholder, error, onChange, value}) => {

    let today = startOfToday();
 
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

  const normalizedSelectedDay = startOfDay(value!);

  return (
    <div className={`w-full ${disabled ? 'opacity-30 cursor-not-allowed':'' }`}>
        {label && (
        <label htmlFor={name} className="block text-sm mb-1 font-">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
    <DropMenu
        className='w-full'
        trigerBtn={
            <Button disabled={disabled} variant={'outline'} className='w-full h-12 flex gap-4 items-center'>
                <Calendar/>
                {
                    value ?
                    format(new Date(value!), 'dd MMMM yyyy')
                    : placeholder
                }
            </Button>
        }
    >
        <div className="w-full p-2 rounded-lg bg-white shadow">
                    <div className="flex pt-2 items-center w-full justify-between gap-4 ">
                        <div>
                            <button

                                disabled={disabled}
                                type="button"
                                onClick={previousMonth}
                                className=" p-1 borde rounded-lg text-gray-400 hover:text-gray-600">
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
                                disabled={disabled}
                                type="button"
                                className=" p-1 borde rounded-lg text-gray-400 hover:text-gray-600">
                                {/* <span className="">Next month</span> */}
                                <ChevronRight className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className=" grid grid-cols-7 mt-4 text-xs leading-6 text-center text-gray-500">
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
                                    'py-1',
                                )}>
                                <button
                                    type="button"
                                    disabled={isDayDisabled(day) || disabled}
                                    onClick={() => {
                                        onChange(day)

                                    }}
                                    className={classNames(
                                        isEqual(normalizedDay, normalizedSelectedDay) && 'text-white',
                                        // !isEqual(normalizedDay, normalizedSelectedDay) &&
                                        //     isToday(normalizedDay) &&
                                        //     ' font-bold',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                            !isToday(normalizedDay) &&
                                            isSameMonth(normalizedDay, firstDayCurrentMonth) &&
                                            'text-gray-90',
                                        !isEqual(normalizedDay, normalizedSelectedDay) &&
                                        !isSameMonth(normalizedDay, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                        
                                        isEqual((normalizedDay), normalizedSelectedDay)  && 'bg-zikoroBlue ',
                                        // !isEqual(normalizedDay, normalizedSelectedDay) && 'hover:bg-gray-200',
                                        isDayDisabled(normalizedDay) ? 'disabled text-gray-300 cursor-not-allowed' : '',
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
    </DropMenu>
    {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}

    </div>
    )
}


let colStartClasses = [
	'',
	'col-start-2',
	'col-start-3',
	'col-start-4',
	'col-start-5',
	'col-start-6',
	'col-start-7',
];
