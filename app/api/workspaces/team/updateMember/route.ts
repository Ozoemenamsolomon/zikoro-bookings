import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const workspaceAlias = searchParams.get('workspaceAlias')!;  
    const userEmail = searchParams.get('userEmail')!;  
    if (!workspaceAlias || !userEmail) {
      console.error("FETCHING TEAMS: Missing workspaceId and email");
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const {data,error,status,statusText}= await supabase
      .from('organizationTeamMembers_Bookings')
      .update(body)
      .eq('workspaceAlias', workspaceAlias)
      .eq('userEmail', userEmail)
      .select("*, workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), userId(profilePicture,id,firstName,lastName,userEmail)")
      .single()

    // console.log('Updating bookingTeam member result:', {body,data,error,status,statusText})
 
    return NextResponse.json({ data, error:error?.message||null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled bookingTeam error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
