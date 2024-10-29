import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
    const {data,error}= await supabase
      .from('bookings')
      .insert(body)
      .select('*')
      .single()

    console.log('Inserting booking result:', {data,error})
    if (error) {
      console.error("Error inserting booking:", error);
      return NextResponse.json({ data:null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, error:null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled appointmentLink error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
