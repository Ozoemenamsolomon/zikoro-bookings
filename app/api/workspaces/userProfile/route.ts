import { User } from "@/types/appointments";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body:User = await req.json();
    // console.log(body)
    const {data,error}= await supabase
      .from('users')
      .update(body)
      .eq('id', body?.id)
      .select('*')
      .single()

    console.log('Inserting userProfile result:', {data,error,body})
    if (error) {
      console.error("Error updating user Profile:", error);
      return NextResponse.json({ data:null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, error }, { status: 200 });
  } catch (error) {
    console.error("Unhandled  user Profile error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
