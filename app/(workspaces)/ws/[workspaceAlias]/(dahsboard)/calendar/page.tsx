import CalendarLayout from "@/components/workspace/calender";
import { fetchCalendarData } from "@/lib/server/calendar";
import React from "react";

// Define types for the parameters
interface SearchParams {
  viewing: "month" | "week";
  date: string; // Date passed as string from URL params
}

interface PageProps {
  params: { workspaceAlias: string };
  searchParams: SearchParams;
}

// Define the return type of fetchCalendarData (adjust based on your actual function return type)
interface CalendarData {
  formattedWeekData?: any; // Replace 'any' with specific types if available
  formattedMonthData?: any;
  startRangeDate: string;
  endRangeDate: string;
  date: string;
  count?: number;
  error?: string;
  dateDisplay: string;
  unavailableDates?: string[];
  viewing: "month" | "week";
  dataCount?: number;
}

const CalendarPage: React.FC<PageProps> = async ({ params, searchParams }) => {
  const workspaceAlias  = (await params).workspaceAlias;
  const  date = (await searchParams).date;
  const  viewing  = (await searchParams).viewing;

  // Fetch calendar data
  const {
    formattedWeekData,
    formattedMonthData,
    startRangeDate,
    endRangeDate,
    date: currentDate,
    count,
    error,
    dateDisplay,
    unavailableDates,
    viewing: view,
    dataCount,
  } = await fetchCalendarData(workspaceAlias, date, viewing);

  return (
    <CalendarLayout
      viewing={view!}
      formattedWeekData={formattedWeekData!}
      date={currentDate}
      formattedMonthData={formattedMonthData!}
      startRangeDate={startRangeDate}
      endRangeDate={endRangeDate}
      count={count!}
      errorMsg={error}
      dateString={dateDisplay!}
      unavailableDates={unavailableDates!}
      dataCount={dataCount!}
    />
  );
};

export default CalendarPage;
