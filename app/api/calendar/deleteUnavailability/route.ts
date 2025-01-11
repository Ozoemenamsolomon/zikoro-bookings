import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const supabase = createClient()

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const id = searchParams.get('id');
  const workspaceId = searchParams.get('workspaceId')!;

  if (!userId || !id) {
    console.error("FETCHUNAVAILABILITY: Missing required parameters: userId || id")
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }
 
  try {
    const { data, error } = await supabase
      .from('appointmentUnavailability')
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting unavailability schedules:", error.message);
      return NextResponse.json({ error: 'Delete Error! Check network.' }, { status: 400 });
    }
    
    // console.log("Deletion successful:", { userId, data });
    return NextResponse.json({ message: 'Deletion successful' }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
