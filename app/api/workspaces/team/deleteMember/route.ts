import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
 
    const {data,error,status,statusText}= await supabase
      .from('organizationTeamMembers_Bookings')
      .delete()
      .eq('id', body.id)
      .select('id')
      .single()

    // console.log('Deleting bookingTeam member result:', {data,error,statusText})
    if (error) {
      console.error("Error inserting team member:", error);
      return NextResponse.json({ data:null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, error }, { status: 200 });
  } catch (error) {
    console.error("Unhandled bookingTeam error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
