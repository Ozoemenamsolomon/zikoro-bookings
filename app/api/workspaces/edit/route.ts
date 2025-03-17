import { OrganizationInput } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient()
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body:OrganizationInput = await req.json();
    // console.log(body)
    const {data,error}= await supabase
      .from('organization')
      .update(body)
      .eq('organizationAlias',body.organizationAlias)
      .select('*')
      .single()

    console.log('Updating bookingWorkspace result:', {data,error})
    if (error) {
      console.error("Error Updating booking workspace:", error);
      return NextResponse.json({ data:null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, error }, { status: 200 });
  } catch (error) {
    console.error("Unhandled booking workspace error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
