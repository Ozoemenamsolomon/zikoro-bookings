// NOT IN USE

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string; createdAt: string, workspaceAlias:string } }
) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error_description");
  const { email, createdAt, workspaceAlias } = params;

  // console.log('error ', error);

  if (code) {
    // const cookieStore = cookies();
    // const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const supabase = createClient()

    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      if (exchangeError) {
        alert("Session has Expired.")
      }
      throw exchangeError
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/onboarding?email=${email}&createdAt=${createdAt}&workspaceAlias=${workspaceAlias}`);
}
