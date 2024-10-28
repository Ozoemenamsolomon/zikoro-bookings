import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
    const result= await supabase
      .from('appointmentUnavailability')
      .insert(body)
      .select('*')
      .single()

    if (result?.error) {
      console.error("Error inserting data:", result?.error.message);
      return NextResponse.json({ data:null, error: result?.error.message }, { status: 400 });
    }

    // console.log('ADD UNAVAILABILITY RESULT:', result)
    return NextResponse.json({ data:result?.data, error:result.error }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
