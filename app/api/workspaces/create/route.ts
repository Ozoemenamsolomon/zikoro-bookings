import { createWorkspace } from "@/lib/server/workspace";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
    console.log({plan:body}) // = body.workspaceData, body.userData

    const {data,error,newTeam,newTeamError}= await createWorkspace(body)

    // return NextResponse.json({ data:{organizationAlias: 'testing-lite-P4Dac'}, error:false}, { status: 200 });
    return NextResponse.json({ data, error, newTeam, newTeamError }, { status: 200 });
  } catch (error) {
    console.error("Unhandled booking workspace error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
