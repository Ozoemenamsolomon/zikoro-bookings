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
      .from('organizationTeamMembers_Bookings')
      .select("*, workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), userId(profilePicture,id,firstName,lastName,userEmail)")
      .eq('workplaceAlias', body.workplaceAlias)
      .eq('userEmail', body.email)
      .single()

    if(existingData){
      return NextResponse.json({ data:existingData, error:null }, { status: 200 });
    }
 
    const {data,error}= await supabase
      .from('organizationTeamMembers_Bookings')
      .insert(body)
      .select('*, workplaceAlias(*)')
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
