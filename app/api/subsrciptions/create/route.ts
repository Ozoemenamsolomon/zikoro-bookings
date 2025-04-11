import { createSubsription } from "@/lib/server/subscriptions";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await req.json();
    console.log({plan:body}) 

    const {data,error} = await createSubsription(body)

    return NextResponse.json({data:{}, error:false}, { status: 200 });
  } catch (error) {
    console.error("Unhandled inserting subscription error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
