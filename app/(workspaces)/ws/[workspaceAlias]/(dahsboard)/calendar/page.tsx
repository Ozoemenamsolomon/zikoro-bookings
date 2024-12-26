import CalendarLayout from "@/components/workspace/calender";
import { fetchCalendarData } from "@/lib/server/calendar";
import React from "react";

interface SearchParams {
  viewing: "month" | "week";
  date: Date;
}

const CalenderPage: React.FC<{ searchParams: SearchParams }> = async ({
  searchParams: { viewing, date },
}) => {
  const { formattedWeekData,formattedMonthData,startRangeDate,endRangeDate,date:currentDate,count,error, dateDisplay,unavailableDates,viewing:view, dataCount} =  await fetchCalendarData(date, viewing)

  return <CalendarLayout viewing={view!} formattedWeekData={formattedWeekData!} date={currentDate} formattedMonthData={formattedMonthData!} startRangeDate={startRangeDate} endRangeDate={endRangeDate} count={count!} errorMsg={error} dateString={dateDisplay!} unavailableDates={unavailableDates!} dataCount={dataCount!}/>;
};

export default CalenderPage;
