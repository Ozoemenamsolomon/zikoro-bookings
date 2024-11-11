import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { BookingsContact } from "@/types/appointments";

export async function POST(req: NextRequest) {
  const supabase = createClient()

  if (req.method === "POST") {
    const body = await req.json()

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }

    try {
      const { data, error } = await supabase
      .from('bookingTags')
      .insert([body])
      .select()
      .single()

        // console.log('Favorite contact result', {data,error})
        if (error) {
          console.error("Error adding new tag", error);
          return NextResponse.json({ data:null, error: error.message }, { status: 400 });
        }
    
        return NextResponse.json({ data, error:null }, { status: 200 });
      } catch (error) {
        console.error("Unhandled adding new tag:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 500 }
        );
      }
    }
  }