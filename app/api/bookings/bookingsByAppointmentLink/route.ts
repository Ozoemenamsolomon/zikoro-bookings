import { fetchAppointments, fetchBookings } from "@/lib/server/appointments";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const { searchParams } = new URL(req.url);
    const appointmentDate = searchParams.get('appointmentDate')!;  
    const appointmentLinkId = searchParams.get('appointmentLinkId')!;

    try {
      const {data, error} = await fetchBookings({appointmentDate, appointmentLinkId})
  
      if (error) {
        return NextResponse.json({data:null, error: error }, { status: 400 });
      }
      return NextResponse.json({ data, error:null }, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled appointments error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  