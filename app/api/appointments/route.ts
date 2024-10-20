import { fetchAppointments } from "@/lib/server/appointments";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')!;  
    const userId = searchParams.get('userId')!;

    try {
        const {data, count, error} = await fetchAppointments({userId, type})
        console.error({ data, count, error });
  
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
  