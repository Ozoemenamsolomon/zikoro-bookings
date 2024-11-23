import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
    const supabase = createClient()
    const {keyResultData,timeLineData} = await req.json()
    // console.log({keyResultData,timeLineData} )
    try {
      const { data, error } = await supabase
        .from('keyResults')
        .insert(keyResultData)
        .select()
        .single()
        
      if(error) {
        console.error("Error inserting KEYRESULT:", error.message);
        return NextResponse.json({ data:null, error:error.message }, { status: 200 });
      }

      const { data:timeline, error:timelineError } = await supabase
        .from('keyResultsTimeline')
        .insert({...timeLineData, keyResultId: data.id })
        .select()
        .single()
        
      if(timelineError) {
        console.error("Error inserting TIMELINE:", timelineError.message);
        return NextResponse.json({ data:null, error:timelineError.message }, { status: 200 });
      }
    console.log('GOAL CREATED:', {data,timeline})
    return NextResponse.json({ data, error}, { status: 200 });
    } catch (error) {
        console.error("Unhandled error in GOAL API:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 500 }
        );
    }
}