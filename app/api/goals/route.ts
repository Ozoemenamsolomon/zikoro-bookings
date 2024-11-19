import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const supabase = createClient()

    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy')!;  
    const contactId = searchParams.get('contactId')!;
    const offset = Number(searchParams.get('offset')!);
    const limit = Number(searchParams.get('limit')!);

    try {
        const { data, count, error } = await supabase
          .from('goals')
          .select('*', { count: 'exact' })
          .eq('createdBy', createdBy)
          .eq('id', contactId)
          .range(offset, offset + limit - 1)
          .order('created_at', {ascending:false})

          console.log({ data, count, error })
      return NextResponse.json({ data, count, error :error?.message||null}, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled goals error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  