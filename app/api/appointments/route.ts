
import { fetchAppointments } from "@/lib/server/appointments";
import { BookingsQuery } from "@/types/appointments";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Extract query parameters
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId")!;
  const workspaceId = searchParams.get("workspaceId")!;

  // Properly validate 'type'
  const type = searchParams.get("type");
  const isValidType = type === "upcoming-appointments" || type === "past-appointments";
  const validatedType: "upcoming-appointments" | "past-appointments" | null = isValidType ? type : null;

  const searchQuery: BookingsQuery = {
    type: validatedType,
    date: searchParams.get("date") || null,
    search: searchParams.get("search") || null,
    status: searchParams.get("status") || null,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : null,
    appointmentDate: searchParams.get("appointmentDate") || null,
    appointmentName: searchParams.get("appointmentName") || null,
    teamMember: searchParams.get("teamMember") || null,
  };

  // Ensure required params are present
  if (!workspaceId) {
    console.error("FETCH APPOINTMENT BOOKINGS: Missing required parameter: workspaceId");
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    // Fetch appointments with the structured query
    const { data, count, error } = await fetchAppointments({ searchQuery, workspaceId, userId });

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({ data: null, error }, { status: 400 });
    }

    return NextResponse.json({ data, count, error: null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled appointments error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}




// import { fetchAppointments } from "@/lib/server/appointments";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//     if (req.method !== "GET") {
//       return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
//     }
    
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get('type')!;  
//     const userId = searchParams.get('userId')!;
//     const date = searchParams.get('date')!;
//     const workspaceId = searchParams.get('workspaceId')!;

//     if ( !workspaceId ) {
//       console.error("FETCH APPOINTMENT BOOKINGS: Missing required parameters: workspaceId")
//       return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
//     }
//     try {
//         const {data, count, error} = await fetchAppointments({workspaceId, userId, searchQuery})
//         // console.error({ data, count, error });
  
//       if (error) {
//         console.error("Error fetching bookings:", error);
//         return NextResponse.json({data:null, error: error }, { status: 400 });
//       }
//       return NextResponse.json({ data, count, error:null }, { status: 200 });
  
//     } catch (error) {
//       console.error("Unhandled appointments error:", error);
  
//       return NextResponse.json(
//         { error: "An error occurred while processing the request" },
//         { status: 500 }
//       );
//     }
//   }
  