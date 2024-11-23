import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
    const supabase = createClient()
    const {timeLineData} = await req.json()
    // console.log({keyResultData,timeLineData} )
    try {
      const { data, error } = await supabase
        .from('keyResultsTimeline')
        .insert(timeLineData)
        .select()
        .single()

    console.log('TIMELINE CREATED:', {data, error: error?.message ||null})
    return NextResponse.json({ data,  error: error?.message ||null}, { status: 200 });
    } catch (error) {
        console.error("Unhandled error in TIMELINE API:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 500 }
        );
    }
}