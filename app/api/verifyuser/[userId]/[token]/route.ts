import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_SERVICE_ROLE_KEY=`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGVwdWpwYnFqb29na21pd2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTYwNjQ5NCwiZXhwIjoyMDE3MTgyNDk0fQ.Z4cc23CFZ8Ra7YLsphgvbEW6d_nrOKKCmYao6sA7_Jc`
const SUPABASE_URL=`https://ddlepujpbqjoogkmiwfu.supabase.co` 

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
  // process.env.SUPABASE_URL!,
  // process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string; token: string } }
) {
  const { userId, token } = params;

  if (!userId || !token) {
    return NextResponse.json(
      { error: "Missing userId or token." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !data.user) {
      return NextResponse.json(
        { error: "User not found or an error occurred." },
        { status: 404 }
      );
    }

    const userMetadata = data.user.user_metadata;
    const userToken = userMetadata?.verification_token;
    const workspaceAlias = userMetadata?.workspaceAlias||'';

    if (userToken !== token) {
      return NextResponse.json(
        { error: "Invalid verification token." },
        { status: 401 }
      );
    }

    // Update user email confirmation
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user verification status." },
        { status: 500 }
      );
    }

    return NextResponse.json({data: {workspaceAlias} }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Ensure this route is always dynamically rendered
export const dynamic = "force-dynamic";
