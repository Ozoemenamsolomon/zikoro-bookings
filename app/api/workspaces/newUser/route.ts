import { assignMyWorkspace, updateBookingTeamUserId } from "@/lib/server/workspace";
import { BookingWorkSpace } from "@/types";
import { NextRequest, NextResponse } from "next/server";


// updating user userId if assigned a workspace and assign a default 'my workspace' using organization name.

export async function POST(req: NextRequest) {

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const workspaces: BookingWorkSpace[] = [];
  
  try {
    const { email, userId, role, organization } = await req.json();

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: email or userId" },
        { status: 400 }
      );
    }

    // Update user team details if a role is provided
    if (role!=='none') {
      const { data: teamData, error: teamError } = await updateBookingTeamUserId(userId, email);
      if (teamError) {
        console.error("Error updating team user ID:", teamError);
        return NextResponse.json({ error: teamError }, { status: 400 });
      }

      if (teamData) {
        workspaces.push(teamData?.workspaceId);
      }
    }

    // Assign default workspace
    const { data: workspaceData, error: workspaceError } = await assignMyWorkspace(userId, email, organization);

    if (workspaceError) {
      console.error("Error assigning workspace:", workspaceError);
      return NextResponse.json({ error: workspaceError }, { status: 400 });
    }

    if (workspaceData) {
      workspaces.push(workspaceData);
    }

    console.log("New Team Booking Workspace Result:", workspaces);

    return NextResponse.json({ data: workspaces, error: null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error while processing workspace:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
