import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const supabase = createClient()
    
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy')!;  
    const workspaceId = searchParams.get('workspaceId');
    
    if ( !workspaceId ) {
      console.error("FETCHING CONTACT TAGS: Missing required parameters: workspaceId")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
    try {
      const { data, error } = await supabase
        .from('bookingTags')
        .select('tag')
        .eq('workspaceId', workspaceId)
        .range(0, 19);       
          // console.error({ data, error });
  
      if (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json({data,  error:error.message }, { status: 400 });
      }
      return NextResponse.json({ data,  error:null }, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled tags fetching error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  