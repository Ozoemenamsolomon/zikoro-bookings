import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
    // check if this data has been implemented 
    const {data:existingData,error:err}= await supabase
      .from('bookingTeams')
      .select('*, workspaceId(*)')
      .eq('workplaceId', body.workplaceAlias)
      .eq('email', body.email)
      .single()

    if(existingData){
      return NextResponse.json({ data:existingData, error:null }, { status: 200 });
    }
 
    const {data,error}= await supabase
      .from('bookingTeams')
      .insert(body)
      .select('*, workspaceId(*)')
      .single()

    console.log('Inserting bookingTeam member result:', {data,error})
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
