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
  const { data,startRangeDate,endRangeDate,date:currentDate,count,error, dateDisplay} =  await fetchCalendarData(date, viewing)

  return <CalendarLayout viewing={viewing} date={currentDate} data={data!} startRangeDate={startRangeDate} endRangeDate={endRangeDate} count={count!} errorMsg={error} dateString={dateDisplay!}/>;
};

export default CalenderPage;
