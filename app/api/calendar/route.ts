
import {  fetchCalendarData } from "@/lib/server/calendar";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get('viewing'); // 'month' or 'week'
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  // Check for valid parameters
  if (view !== 'month' && view !== 'week') {
    return NextResponse.json({ error: "Invalid 'view' parameter" }, { status: 400 });
  }
  if (!date || !userId) {
    return NextResponse.json({ error: "Missing 'date' or 'userId' parameter" }, { status: 400 });
  }

  try {
    const {
      data,
      startRangeDate,
      endRangeDate,
      date: formattedDate,
      count,
      error,
      dateDisplay,
    } = await fetchCalendarData(date, view, userId);

    // Check for data fetch errors
    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({
        data,
        startRangeDate,
        endRangeDate,
        date: formattedDate,
        count,
        error,
        dateDisplay,
      }, { status: 500 });
    }

    return NextResponse.json({
      data,
      startRangeDate,
      endRangeDate,
      date: formattedDate,
      count,
      error: null,
      dateDisplay,
    }, { status: 200 });

  } catch (err) {
    console.error("Unhandled error:", err);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

