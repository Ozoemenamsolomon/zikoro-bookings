import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
    const supabase = createClient()
    const {goalData,} = await req.json()
    // console.log({goalData,keyResultData,timeLineData} )
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', goalData.id)
        .select()
        .single()
        
    console.log('GOAL EDITTED:', {data,error})
    return NextResponse.json({ data, error}, { status: 200 });
    } catch (error) {
        console.error("Unhandled error in GOAL API:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 200 }
        );
    }
}