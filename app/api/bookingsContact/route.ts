import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { fetchContacts } from "@/lib/server/contacts";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.json() 
    
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }
    
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('bookingsContact')
        .insert( body)
        .select('*')
        .single()

      console.log('INSERTING CONTACT', {data,error})
 
      return NextResponse.json({ data,  error: error?.message||null }, { status: 200 });
    } catch (error) {
      console.log('INSERTING CONTACT UNHANDLED ERROR', error)
      return NextResponse.json({ data:null,  error: 'Unhandled errror' }, { status: 500 });
    }
  }
}

export async function GET(req: NextRequest) {
  if (req.method === "GET") {

    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId')!;

    if ( !workspaceId ) {
      console.error("FETCHING CONTACTS: Missing required parameters: workspaceId")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    try {
      const { data, error, count } = await fetchContacts(workspaceId)
      console.log('INSERTING CONTACTS', { data, error, count } )


      return NextResponse.json({ data,  error, count }, { status: 200 });
    } catch (error) {
      console.log('INSERTING CONTACT UNHANDLED ERROR', error)
      return NextResponse.json({ data:null,  error: 'Unhandled errror', count:null }, { status: 500 });
    }
  }
}


export const dynamic = "force-dynamic";

