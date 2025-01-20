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
    const workspaceId = searchParams.get('workspaceAlias')!;  
    const email = searchParams.get('email')!;  

    if (!workspaceId || !email) {
      console.error("FETCHING TEAMS: Missing workspaceId and email");
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const {data,error}= await supabase
      .from('bookingTeams')
      .update(body)
      .eq('workspaceId', workspaceId)
      .eq('email', email)
      .select('*, workspaceId(*), userId(*)')
      .single()

    console.log('Updating bookingTeam member result:', {data,error})
 
    return NextResponse.json({ data, error:error?.message||null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled bookingTeam error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
