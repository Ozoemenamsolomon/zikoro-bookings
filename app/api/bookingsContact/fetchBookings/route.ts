import { fetchAppointments, fetchBookings } from "@/lib/server/appointments";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const supabase = createClient()

    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy')!;  
    const contactEmail = searchParams.get('contactEmail')!;
    const offset = Number(searchParams.get('offset')!);
    const limit = Number(searchParams.get('limit')!);
    const ltToday = searchParams.get('ltToday');
    const gteToday = searchParams.get('gteToday');
    const workspaceId = searchParams.get('workspaceId');

    if ( !workspaceId ) {
      console.error("FETCHING CONTACT BOOKINGS: Missing required parameters: workspaceId")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
// console.log({ltToday,gteToday, searchParams})
    try {
      let query = supabase
          .from('bookings')
          .select(
            'id, created_at, appointmentDuration, appointmentDate, appointmentName, appointmentTimeStr, appointmentLinkId(locationDetails)', 
            { count: 'exact' }
          )
          .eq('createdBy', createdBy)
          .eq('participantEmail', contactEmail)
          .eq('workspaceId', workspaceId)
          .range(offset, offset + limit - 1)

          if(ltToday){
            query = query.lt('appointmentDate', ltToday)
          }
          if(gteToday){
            query = query.gte('appointmentDate', gteToday)
          }

          const {data:initialData}= await query
          const { data, count, error } = await query.order('appointmentDate', { ascending: false })
          console.log(initialData?.[0]?.created_at)
      if (error) {
        return NextResponse.json({data:null, error: error.message, count }, { status: 400 });
      }
      return NextResponse.json({ data, error:null, count, first: initialData?.[0]?.created_at }, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled appointments error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  