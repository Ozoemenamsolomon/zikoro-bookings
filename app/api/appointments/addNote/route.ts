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
      .from('bookingNote')
      .insert([body])
      .select("*, createdBy(id, userEmail, organization, firstName, lastName, phoneNumber)" )
      .single()

        console.log('ADDING NOTE RESULT: ', {data,error})
        if (error) {
          console.error("Error adding new note", error);
          return NextResponse.json({ data:null, error: error.message }, { status: 400 });
        }
    
        return NextResponse.json({ data, error:null }, { status: 200 });
      } catch (error) {
        console.error("Unhandled adding new note:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 500 }
        );
      }
    }
  }