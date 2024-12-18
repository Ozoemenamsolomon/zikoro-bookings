import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.method !== "GET") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const supabase = createClient()

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get('goalId')!;  

    try {
        const { data, count, error } = await supabase
          .from('keyResults')
          .select('*', { count: 'exact' })
          .eq('goalId', goalId)
          .order('created_at', {ascending:true})

          console.log({ count, error })
      return NextResponse.json({ data, count, error :error?.message||null}, { status: 200 });
  
    } catch (error) {
      console.error("Unhandled goals error:", error);
      return NextResponse.json(
        { error: "An error occurred while processing the request" },
        { status: 500 }
      );
    }
  }
  