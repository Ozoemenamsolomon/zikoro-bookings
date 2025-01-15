
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient()

  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  const workspaceId = searchParams.get('workspaceId')!;

  if ( !workspaceId ) {
    console.error("FETCHUNAVAILABILITY: Missing required parameters: workspaceId")
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  if ( !userId   ) {
    console.error("FETCHUNAVAILABILITY: Missing required parameters: userId")
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  let data, error, count
  try {
    if(date){
      const { data:dataa, error:err, count:cc } = await supabase
      .from('appointmentUnavailability')
      .select('*',  { count: 'exact' })
      .eq("workspaceId", workspaceId)
      .eq("createdBy", userId)
      .eq("appointmentDate", date)
      data=dataa, error=err, count=cc
    } else {
      const { data:dataa, error:err,  count:cc } = await supabase
      .from('appointmentUnavailability')
      .select('*',  { count: 'exact' })
      .eq("createdBy", userId)
      data=dataa, error=err, count=cc
    }
    
    if (error) {
      console.error("Error fetching unavailability schedules:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // console.log({  userId,error,data,count})
    return NextResponse.json({ data, count }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}