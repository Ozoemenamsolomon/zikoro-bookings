
import { fetchAppointments, fetchBookingNotes } from "@/lib/server/appointments";
import { BookingsQuery } from "@/types/appointments";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Extract query parameters
  const { searchParams } = new URL(req.url);

  const bookingId = searchParams.get("bookingId")!;
 
  // Ensure required params are present
  if (!bookingId) {
    console.error("FETCH BOOKING NOTES: Missing required parameter: bookingId");
    return NextResponse.json({ error: "Missing required parameters: bookingId" }, { status: 400 });
  }

  try {
    const { data, count, error } = await fetchBookingNotes(bookingId);

    if (error) {
      console.error("Error fetching bookings notes:", error);
      return NextResponse.json({ data: null, error }, { status: 400 });
    }

    return NextResponse.json({ data, count, error: null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
