import { fetchAnalytics } from "@/lib/server/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const userId = url.searchParams.get("userId");
    const workspaceId = url.searchParams.get('workspaceId')!;

    if (!userId || !type  ) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if ( !workspaceId ) {
      console.error("FETCH ANALYTICS: workspaceId missing")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const {curList, prevList, error, count} = await fetchAnalytics({type, userId,workspaceId})

    if (error) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { cur: curList, prev: prevList },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
