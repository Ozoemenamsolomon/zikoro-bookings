'use client'

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { endOfWeek, addMonths, subMonths, addWeeks, subWeeks, format, startOfWeek, isWithinInterval, isValid } from "date-fns";
import { Booking, UnavailabilityByDay } from "@/types/appointments";
import { useCalendarData } from "@/hooks/services/appointments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "@/components/shared/Loader";
import Empty from "./Empty";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";

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
  }

const CalendarLayout: React.FC<SearchParams> = ({
  viewing,date,formattedWeekData,formattedMonthData,count,startRangeDate,endRangeDate,errorMsg,dateString,unavailableDates}) => {
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
  }, [view, currentDate]);

  return (
    <div className="flex flex-col gap-8 h-full">
      <section className="flex w-full flex-shrink-0 justify-between gap-1 flex-col sm:flex-row pb-">
        <div className="flex gap-x- items-center">
          <button
            onClick={previous}
            type="button"
            className="text-basePrimary hover:-translate-x-0.5 duration-200"
          >
            <ChevronLeft />
          </button>

          <h4 className="text-xl font-semibold">{dateDisplay}</h4>

          <button
            onClick={next}
            type="button"
            className="text-basePrimary hover:translate-x-0.5 duration-200"
          >
            <ChevronRight />
          </button>

          {loading || calendarData.count ? (
            <>
              <p className="pr-2">-</p>
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
            </>
          ) : null}
        </div>

        <div className="flex justify-end">
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