import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
    const supabase = createClient()
    const {goalData,keyResultData} = await req.json()
    // console.log({goalData,keyResultData,timeLineData} )
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert(goalData)
        .select()
        .single()
        
      if(error) {
        console.error("Error inserting GOALS:", error.message);
        return NextResponse.json({ data:null, error:error.message }, { status: 200 });
      }

      const { data:keyResult, error:keyResultErr } = await supabase
        .from('keyResults')
        .insert({...keyResultData, goalId:data.id})
        .select()
        .single()
        
      if(keyResultErr) {
        console.error("Error inserting KEYRESULT:", keyResultErr.message);
        return NextResponse.json({ data:null, error:keyResultErr.message }, { status: 200 });
      }

    // console.log('GOAL CREATED:', {data,keyResult,timeline})
    return NextResponse.json({ data, error}, { status: 200 });
    } catch (error) {
        console.error("Unhandled error in GOAL API:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 500 }
        );
    }
}