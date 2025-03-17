import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    return NextResponse.json({ msg: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Ensure this route is always dynamically rendered
export const dynamic = "force-dynamic";
