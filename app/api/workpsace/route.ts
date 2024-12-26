import { fetchWorkspaces } from "@/lib/server/workspace";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId')!;  
    const {data,error,count} = await fetchWorkspaces(userId) 

    if (error) {
      console.error("Error fetching booking workspace:", error);
      return NextResponse.json({ data:null, error: error, count:0 }, { status: 400 });
    }

    return NextResponse.json({ data, error:null, count }, { status: 200 });
  } catch (error) {
    console.error("Unhandled booking workspace error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
