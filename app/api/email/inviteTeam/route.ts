import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";
import jwt from "jsonwebtoken";
import { baseUrl } from "@/utils/baseUrl";
import { createWorkspaceTeamMember } from "@/lib/server/workspace";
import { createClient } from "@/utils/supabase/server";

// Initialize ZeptoMail client with environment variables
const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL!,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN!,
});

const senderAddress = process.env.NEXT_PUBLIC_EMAIL!; // Email sender address
const senderName = "Zikoro"; // Sender name
const jwtSecret = process.env.AUTH0_SECRET!; // JWT secret for token generation

// Function to generate an invitation token using JWT
function generateInviteToken(email: string, workspaceName: string, role: string, workspaceAlias: string): string {
  return jwt.sign(
    { email, workspaceName, role, workspaceAlias },
    jwtSecret,
    { expiresIn: "5d" } // Token expires in 5 days
  );
}

// Function to generate the email body for the invitation
function generateEmailBody(email: string, workspaceName: string, role: string, workspaceAlias: string, baseUrl: string): string {
  const token = generateInviteToken(email, workspaceName, role, workspaceAlias);
  const inviteLink = `${baseUrl}/login?token=${token}`; // Generate invite link with token
  return `
    <p>You have been invited to join the <strong>${workspaceName}</strong> team as a <strong>${role}</strong>.</p>
    <p>Please click the link below to accept your invitation:</p>
    <a href="${inviteLink}">Accept Invitation</a>
    <p>This link will expire in 5 days.</p>
  `;
}

// API Route to handle invitation requests
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse request body
    const { emails, role, workspaceName, workspaceAlias } = await req.json();
    const url = new URL(req.url);
    const memberEmail: string | null = url.searchParams.get("memberEmail");

    // Validate required fields
    if (!emails?.length || !role || !workspaceName || !workspaceAlias) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient(); // Initialize Supabase client
    const rootUrl = req.headers.get("origin") || baseUrl!; // Determine base URL
    const subject = `Invitation to join the ${workspaceName} team.`;

    // Process invitations for each email
    const tasks = emails.map((email: string) => {
      const htmlBody = generateEmailBody(email, workspaceName, role, workspaceAlias, rootUrl);

      // Send invitation email via ZeptoMail
      const sendEmail = client.sendMail({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ email_address: { address: email, name: "BookingWorkspaceTeamMember" } }],
        subject,
        htmlbody: htmlBody,
      });

      let insertData;

      // If memberEmail is provided, update existing team member; otherwise, create a new one
      if (!memberEmail) {
        insertData = createWorkspaceTeamMember({ userEmail:email, userRole:role, workspaceAlias });
      } else {
        insertData = supabase
          .from("organizationTeamMembers_Bookings")
          .update({ userEmail:email, userRole:role })
          .eq("workspaceAlias", workspaceAlias)
          .eq("userEmail", memberEmail)
          .select('*, workspaceAlias(*), userId(*)')
          .single();
      }

      return Promise.allSettled([sendEmail, insertData]); // Execute both tasks concurrently
    });

    const results = await Promise.allSettled(tasks); // Wait for all promises to resolve

    // Arrays to store failed operations
    const failedEmails: string[] = [];
    const dbErrors: string[] = [];
    let storage: any[] = [];

    // Process results
    results.forEach((result, index) => {
      const email = emails[index];
      if (result.status === "fulfilled") {
        const [emailResult, dbResult] = result.value;
// console.log({emailResult, dbResult})
        storage?.push(dbResult.value?.data);

        if (emailResult.status !== "fulfilled") {
          failedEmails.push(email);
        }

        if (dbResult.value.error) {
          dbErrors.push(`${email}: ${dbResult.value.error}`);
        }
      } else {
        console.error(`Unhandled error for ${emails[index]}:`, result.reason);
      }
    });

    console.error( {failedEmails,dbErrors,storage});

    // If any failures occurred, return partial success response
    if (failedEmails.length || dbErrors.length) {
      return NextResponse.json(
        {
          error: "Some operations failed",
          failedEmails,
          dbErrors,
        },
        { status: 207 } // 207: Multi-Status (some operations failed)
      );
    }

    return NextResponse.json({ success: "All operations completed successfully", data: storage }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
