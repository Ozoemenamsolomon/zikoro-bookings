import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";
import jwt from "jsonwebtoken";
import { baseUrl } from "@/utils/baseUrl";
import { createWorkspaceTeamMember, updateBookingTeamUserId } from "@/lib/server/workspace";
import { BookingTeamMember } from "@/types";
import { createClient } from "@/utils/supabase/server";

const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL!,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN!,
});

const senderAddress = process.env.NEXT_PUBLIC_EMAIL!;
const senderName = "Zikoro";
const jwtSecret = process.env.AUTH0_SECRET!;

// Helper function to generate JWT token
function generateInviteToken(email: string, workspaceName: string, role: string, workspaceAlias: string): string {
  return jwt.sign(
    { email, workspaceName, role, workspaceAlias },
    jwtSecret,
    { expiresIn: "5d" }
  );
}

// Helper function to generate email body
function generateEmailBody(email: string, workspaceName: string, role: string, workspaceAlias: string, baseUrl: string): string {
  const token = generateInviteToken(email, workspaceName, role, workspaceAlias);
  const inviteLink = `${baseUrl}/login?token=${token}`;
  return `
    <p>You have been invited to join the <strong>${workspaceName}</strong> team as a <strong>${role}</strong>.</p>
    <p>Please click the link below to accept your invitation:</p>
    <a href="${inviteLink}">Accept Invitation</a>
    <p>This link will expire in 5 days.</p>
  `;
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { emails, role, workspaceName, workspaceAlias } = await req.json();
    const url = new URL(req.url);
    const memberEmail:string|null = url.searchParams.get("memberEmail");

    if (!emails?.length || !role || !workspaceName || !workspaceAlias) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient()

    const rootUrl = req.headers.get("origin") || baseUrl!;
    const subject = `Invitation to join the ${workspaceName} team.`;

    const tasks = emails.map((email: string) => {
      const htmlBody = generateEmailBody(email, workspaceName, role, workspaceAlias, rootUrl);

      const sendEmail = client.sendMail({
        from: {
          address: senderAddress,
          name: senderName,
        },
        to: [{ email_address: { address: email, name: "BookingWorkspaceTeamMember" } }],
        subject,
        htmlbody: htmlBody,
      });

      let insertData

      if(!memberEmail) {
        insertData = createWorkspaceTeamMember({ email, role, workspaceId: workspaceAlias });
      } else {
        insertData = supabase
                    .from('bookingTeams')
                    .update({email, role,}) 
                    .eq('workspaceId', workspaceAlias)
                    .eq('email', memberEmail)
                    .select('*, workspaceId(*)')
                    .single()
      }

      return Promise.allSettled([sendEmail, insertData]);
    });

    const results = await Promise.allSettled(tasks);

    const failedEmails: string[] = [];
    const dbErrors: string[] = [];
    let storage:any[] = [];

    results.forEach((result, index) => {
      const email = emails[index];
      if (result.status === "fulfilled") {
        const [emailResult, dbResult] = result.value;

        storage?.push(dbResult.value.data) 

        // console.log({emailResult:emailResult.value.data, dbResult })

        if (emailResult.status !== "fulfilled") {
          failedEmails.push(email);
        }

        if (dbResult.status !== "fulfilled") {
          dbErrors.push(`${email}: ${dbResult.reason}`);
        }
      } else {
        console.error(`Unhandled error for ${emails[index]}:`, result.reason);
      }
    });

    if (failedEmails.length || dbErrors.length) {
      return NextResponse.json(
        {
          error: "Some operations failed",
          failedEmails,
          dbErrors,
        },
        { status: 207 }
      );
    }

    return NextResponse.json({ success: "All operations completed successfully", data:storage }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
