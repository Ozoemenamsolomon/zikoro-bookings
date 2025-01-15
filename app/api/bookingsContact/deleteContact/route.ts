import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    if (req.method !== "DELETE") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const supabase = createClient()
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')!;  

    try {
      const {data, error} = await supabase
      .from('bookingsContact')
      .delete()
      .eq('id', id)
  // TODO: confirm that the cascaded table items are deleted too
      if (error) {
        console.error("Error deleting contact:", error);
        return NextResponse.json({data,  error:error.message }, { status: 400 });
      }
      return NextResponse.json({ data,  error:null }, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled deleting contact error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  