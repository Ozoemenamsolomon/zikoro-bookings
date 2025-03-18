import { assignMyWorkspace, updateBookingTeamUserId } from "@/lib/server/workspace";
import { Organization } from "@/types";
import { NextRequest, NextResponse } from "next/server";


// updating user userId if assigned a workspace and assign a default 'my workspace' using organization name.

export async function POST(req: NextRequest) {

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const workspaces: Organization[] = [];
  
  try {
    const { email, userId, workspaceAlias, organization, name,organizationType, phoneNumber, country } = await req.json();
    // console.log( { email, userId, workspaceAlias, organization,name,organizationType, phoneNumber, country})

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: email or userId" },
        { status: 200 }
      );
    }

    // Update user team details if a workspaceAlias is provided
    if (workspaceAlias&&workspaceAlias!=='none') {
      const { data: teamData, error: teamError } = await updateBookingTeamUserId(userId, email, workspaceAlias);
      if (teamError) {
        console.error("Error updating team user ID:", teamError);
        return NextResponse.json({ error: teamError }, { status: 400 });
      }
 
      if (teamData) {
        workspaces.push(teamData?.workspaceAlias);
      }
    }

    // Assign a default workspace
    const { data: workspaceData, error: workspaceError } = await assignMyWorkspace(userId, email, organization, name||'',organizationType,phoneNumber, country );

    if (workspaceError) {
      console.error("Error assigning workspace:", workspaceError);
      return NextResponse.json({ error: workspaceError }, { status: 400 });
    }

    if (workspaceData) {
      workspaces.push(workspaceData);
    }

    // console.log("New Team Booking Workspace Result:", workspaces);

    return NextResponse.json({ data: workspaces, error: null }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error while processing workspace:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
