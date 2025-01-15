import { fetchTeamMembers } from "@/lib/server/workspace";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      console.error("FETCHING TEAMS: Missing workspaceId");
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const { data, error } = await fetchTeamMembers(workspaceId);

    if (error) {
      console.error("Error fetching team members:", error);
    }

    return NextResponse.json({ data, error }, { status: 200 });
  } catch (err: any) {
    console.error("Unhandled error in fetching team members:", err.message);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
