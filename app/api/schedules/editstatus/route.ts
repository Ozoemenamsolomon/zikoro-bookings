import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "PUT") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    if(!body?.id){
        return NextResponse.json({ data:null, error: 'Item Id is missing in the body' }, { status: 400 });
    }
    const result= await supabase
      .from('appointmentLinks')
      .update(body)
      .eq('id', body?.id)
      .select('*')
      .single()

    if (result?.error) {
      return NextResponse.json({ data:null, error: result?.error.message }, { status: 400 });
    }

    console.log('Updating appointmentLink result:', result)
    return NextResponse.json({ data:result?.data, error:result.error }, { status: 200 });
  } catch (error) {
    console.error("Unhandled appointmentLink error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
