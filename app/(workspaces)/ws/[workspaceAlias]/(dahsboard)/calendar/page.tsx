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

const CalendarPage: React.FC<PageProps> = async ({ params, searchParams }) => {
  const workspaceId  = (await params).workspaceAlias;
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
  } = await fetchCalendarData(workspaceId, date, viewing);

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
