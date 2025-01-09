import { fetchAppointments } from "@/lib/server/appointments";
import { fetchSchedule, fetchSchedules } from "@/lib/server/schedules";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    
    const { searchParams } = new URL(req.url);
    const end = searchParams.get('end')!;  
    const userId = searchParams.get('userId')!;
    const start = searchParams.get('start')!;
    const workspaceId = searchParams.get('workspaceId')!;

    if ( !workspaceId ) {
      console.error("FETCHING SCHEDULES: Missing required parameters: workspaceId")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    try {
        const {data, count, error} = await fetchSchedules(workspaceId, userId, start, end)
  
      if (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({data:null, error: error }, { status: 400 });
      }
      return NextResponse.json({ data, count, error:null }, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled appointments error:", error);
  
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  