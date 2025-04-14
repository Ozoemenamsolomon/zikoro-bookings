import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/types/appointments";
import { populateBookingReminders } from "@/lib/bookingReminders";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body:any = await req.json() 
    // console.log('INSERTING BOOKING REMINDER: ', body)
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    try {
      const res = await populateBookingReminders(body, body.appointmentLinkId.createdBy.userEmail, body.appointmentLinkId.createdBy.phoneNumber)
      console.log(' BOOKING REMINDER RESULT: ', res)
 
      return NextResponse.json({ data: res?.success,  error: res?.error }, { status: 200 });
    } catch (error) {
      console.log('INSERTING BOOKINGREMINDER UNHANDLED ERROR', error)
      return NextResponse.json({ data:null,  error: 'Unhandled errror' }, { status: 500 });
    }
  }
}