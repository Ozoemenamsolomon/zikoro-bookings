
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const body = await req.json();

    const { table, id } = body || {};

    if (!table || !id) {
      return NextResponse.json(
        { error: "Missing 'table' or 'id' in request body." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    console.log("ITEM DELETE:", { data, error });

    if (error) {
          console.error("ERROR DELETING ITEM", error);
      return NextResponse.json({ data: null, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: "Successfully deleted item.", error: null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
