'use client'

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { endOfWeek, addMonths, subMonths, addWeeks, subWeeks, format, startOfWeek, isWithinInterval, isValid, startOfMonth, endOfMonth, getDay } from "date-fns";
import { Booking, UnavailabilityByDay } from "@/types/appointments";
import { useCalendarData } from "@/hooks/services/appointments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "@/components/shared/Loader";
import Empty from "./Empty";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";
import EmptyList from "../ui/EmptyList";
import { NoCalendarIcon, urls } from "@/constants";
import Link from "next/link";
import { useAppointmentContext } from "@/context/AppointmentContext";

interface SearchParams {
    viewing: 'month' | 'week';
    date: Date;
    count: number;
    formattedWeekData:  Record<string, Record<number, Booking[]>>|null,
    formattedMonthData: Record<string, Booking[]> | null;
    startRangeDate: Date;
    endRangeDate: Date;
    errorMsg: string | null;
    dateString: string,
    unavailableDates:UnavailabilityByDay
    dataCount: number
  }

const CalendarLayout: React.FC<SearchParams> = ({
  viewing,date,formattedWeekData,formattedMonthData,count,startRangeDate,endRangeDate,errorMsg,dateString,unavailableDates,}) => {
  const {getWsUrl} = useAppointmentContext()

  const {
    calendarData,
    currentDate,
    setCurrentDate,
    loading,
    error,
    getCalendarData,
    view,
    setView,  
  } = useCalendarData({viewing,date,count,formattedWeekData,formattedMonthData,startRangeDate,endRangeDate,errorMsg,});

  const { replace } = useRouter();
  const pathname = usePathname();

  const [dateDisplay, setDateDisplay] = useState<string>(dateString);
  const [dataCount, setDataCount] = useState<number>(0);

  const getAppointmentCount =  useCallback((): number => {
      let startDate: Date;
      let endDate: Date;
  
      if (view === 'month') {
          startDate = startOfMonth(currentDate);
          endDate = endOfMonth(currentDate);
  
          return Object.keys(formattedMonthData || {})
              .filter(dayString => {
                  const date = new Date(dayString);
                  return date >= startDate && date <= endDate;
              })
              .reduce((sum, dayString) => sum + (formattedMonthData?.[dayString]?.length || 0), 0);
  
      } else if (view === 'week') {
          startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Week starts on Sunday
          endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
  
          return Object.keys(formattedWeekData || {})
              .filter(dayString => {
                  const date = new Date(dayString);
                  return date >= startDate && date <= endDate;
              })
              .reduce((sum, dayString) => {
                  // Sum appointments for each hour within this day
                  const dailyHours = formattedWeekData?.[dayString] || {};
                  const dailyCount = Object.values(dailyHours).reduce((hourSum, bookings) => hourSum + bookings.length, 0);
                  return sum + dailyCount;
              }, 0);
      } else {
          throw new Error("Invalid viewType. Use 'month' or 'week'.");
      }
  }, [currentDate,view,formattedMonthData,formattedWeekData])
  
  const updateCalendarData = (newDate:Date, newView:"month" | "week") => {
    if(newView==='week') {
      const start = format(startOfWeek(currentDate), 'MMM d');
      const end = format(endOfWeek(currentDate), 'd, yyyy');
        setDateDisplay(`${start} - ${end}`);
    }else {
        setDateDisplay(format(currentDate, 'MMMM yyyy'));
    }
    const dateInRange = (
        calendarData.startRangeDate &&
        calendarData.endRangeDate &&
        isValid(newDate) &&
        isWithinInterval(newDate, {
          start: calendarData.startRangeDate,
          end: calendarData.endRangeDate,
        })
      );
    if (!dateInRange) {
      getCalendarData(view, currentDate);
    }
  };

  const previous = useCallback(() => {
    const newDate = view === "month" ? subMonths(currentDate, 1) : subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    replace(`${pathname}?viewing=${view}&date=${newDate.toISOString()}`);
  }, [currentDate, view, pathname]);
  
  const next = useCallback(() => {
    const newDate = view === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    replace(`${pathname}?viewing=${view}&date=${newDate.toISOString()}`);
  }, [currentDate, view, pathname]);
  
  const handleSelectView = (newView:"month" | "week") => {
    setView(newView)
    replace(`${pathname}?viewing=${newView}&date=${currentDate.toISOString()}`);
  }

  useEffect(() => {
    updateCalendarData(currentDate, view);
    setDataCount(getAppointmentCount())
  }, [view, currentDate]);

  if(!calendarData.count ){
    return <EmptyList
    icon={<NoCalendarIcon/>}
    heading='Your Calendar is Waiting!'
    text='Booked appointments will show up here to keep your schedule organized and easy to manage.'
    CTA={<Link href={getWsUrl(urls.create)} className='py-3 px-6 font-semibold text-white rounded-md bg-basePrimary' >Start creating</Link>}
    className='lg:h-[40em] '
  />
  }

  return (
    <div className="flex flex-col gap-8 h-full">
      <section className="flex w-full flex-shrink-0 justify-between gap-4 flex-col sm:flex-row pb-">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex gap-2 ">
          <button
            onClick={previous}
            type="button"
            className="text-basePrimary hover:-translate-x-0.5 duration-200"
          >
            <ChevronLeft />
          </button>

          <h4 className="sm:text-xl  font-semibold">{dateDisplay}</h4>

          <button
            onClick={next}
            type="button"
            className="text-basePrimary hover:translate-x-0.5 duration-200"
          >
            <ChevronRight />
          </button>
          </div>

          {loading || calendarData.count ? (
            <div className="flex gap-2 max-sm:pl-2">
              <p className="max-sm:hidden">-</p>
              <p className="font-semibold"
                  style={{
                    background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {dataCount} of
              </p>
              <p
                className="font-semibold"
                style={{
                  background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {loading ? null : `${calendarData.count} meetings`}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex max-sm:pl-2 justify-end">
          <div className="bg-white p-1 flex rounded-xl border-2">
            <button
              onClick={() => handleSelectView("week")}
              className={`${
                view === "week"
                  ? " bg-gradient-to-r from-slate-100 to-purple-100 text-basePrimary"
                  : ""
              } rounded-lg px-6 py-2 font-semibold`}
            >
              Week View
            </button>
            <button
              onClick={() => handleSelectView("month")}
              className={`${
                view === "month"
                  ? " bg-gradient-to-r from-slate-100 to-purple-100 text-basePrimary"
                  : ""
              } rounded-lg px-6 py-2 font-semibold`}
            >
              Month View
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="h-screen w-full flex justify-center items-center">
          <Loading />
        </section>
      ) : !calendarData.count ? (
        <Empty />
      ) : error ? (
        <section className="py-20 text-center w-full">{error}</section>
      ) : view === "month" ? (
        <MonthlyView
          appointments={calendarData?.formattedMonthData as Record<string, Booking[]>}
          currentMonth={currentDate} unavailableDates={unavailableDates}
        />
      ) : (
        <WeeklyView
          appointments={calendarData?.formattedWeekData as Record<string, Record<number, Booking[]>>}
          currentDate={currentDate}
        />
      )}
    </div>
  );
};

export default CalendarLayout;
