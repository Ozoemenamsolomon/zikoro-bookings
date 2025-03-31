import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";
import jwt from "jsonwebtoken";
import { baseUrl } from "@/utils/baseUrl";
import { createWorkspaceTeamMember } from "@/lib/server/workspace";
import { createClient } from "@/utils/supabase/server";

// Initialize ZeptoMail client for sending emails
const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL!,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN!,
});

// Email sender details
const senderAddress = process.env.NEXT_PUBLIC_EMAIL!;
const senderName = "Zikoro";
const jwtSecret = process.env.AUTH0_SECRET!;

// Function to generate an invite JWT token with expiration
function generateInviteToken(email: string, workspaceName: string, role: string, workspaceAlias: string): string {
  return jwt.sign(
    { email, workspaceName, role, workspaceAlias },
    jwtSecret,
    { expiresIn: "5d" } // Token expires in 5 days
  );
}

// Function to generate email body with invitation link
function generateEmailBody(email: string, workspaceName: string, role: string, workspaceAlias: string, baseUrl: string): string {
  const token = generateInviteToken(email, workspaceName, role, workspaceAlias);
  const inviteLink = `${baseUrl}/login?token=${token}`;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="https://bookings.zikoro.com/_next/image?url=%2Flogo.png&w=128&q=75" alt="Zikoro Logo" style="max-width: 150px;" />
      </div>
      <h2 style="color: #333; text-align: center;">You're Invited to Join ${workspaceName}!</h2>
      <p style="color: #555;">Hello,</p>
      <p style="color: #555;">You have been invited to join the <strong>${workspaceName}</strong> team as a <strong>${role}</strong>.</p>
      <p style="color: #555;">Click the button below to accept your invitation:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      </div>
      <p style="color: #555;">This link will expire in 5 days. If you didn’t request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="text-align: center; color: #888; font-size: 12px;">Need help? Visit our <a href="https://bookings.zikoro.com/" style="color: #007bff; text-decoration: none;">support page</a> or contact us.</p>
    </div>
  `;
}

// API handler for inviting team members
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Extract request body data
    const { emails, role, workspaceName, workspaceAlias } = await req.json();
    const url = new URL(req.url);
    const memberEmail: string | null = url.searchParams.get("memberEmail");

    // Validate required fields
    if (!emails?.length || !role || !workspaceName || !workspaceAlias) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createClient();
    const rootUrl = req.headers.get("origin") || baseUrl!;
    const subject = `Invitation to join the ${workspaceName} team.`;

    // Process each email asynchronously
    const tasks = emails.map((email: string) => {
      const htmlBody = generateEmailBody(email, workspaceName, role, workspaceAlias, rootUrl);

      // Send invitation email using ZeptoMail
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

      // If memberEmail is not provided, create a new team member
      if (!memberEmail) {
        insertData = createWorkspaceTeamMember({ userEmail:email, userRole:role, workspaceAlias });
      } else {
        // If memberEmail exists, update existing team member
        insertData = supabase
          .from("organizationTeamMembers_Bookings")
          .update({ userEmail:email, userRole:role,  })
          .eq("workspaceAlias", workspaceAlias)
          .eq("userEmail", memberEmail)
          .select("*, workspaceAlias(organizationAlias,organizationName,organizationOwner,organizationOwnerId), userId(profilePicture,id,firstName,lastName,userEmail)")
          .single();
      }

      // Run both email sending and database operation concurrently
      return Promise.allSettled([sendEmail, insertData]);
    });

    // Await all async tasks
    const results = await Promise.allSettled(tasks);

    // Initialize error tracking arrays
    const failedEmails: string[] = [];
    const dbErrors: string[] = [];
    let storage: any[] = [];

    // Process results
    results.forEach((result, index) => {
      const email = emails[index];
      if (result.status === "fulfilled") {
        const [emailResult, dbResult] = result.value;
console.log({emailResult, dbResult})
        storage.push(dbResult.value?.data);

        // Track failed email operations
        if (emailResult.status !== "fulfilled") {
          failedEmails.push(email);
        }

        // Track failed database operations
        if (dbResult.status !== "fulfilled" || dbResult.value.error) {
          dbErrors.push(`${email}: ${dbResult.value.error || dbResult.reason }`);
        }
      } else {
        console.error(`Unhandled error for ${emails[index]}:`, result.reason);
      }
    });

    // Return partial failure response if any errors occurred
    if (failedEmails.length || dbErrors.length) {
      return NextResponse.json(
        {
          error: "Some operations failed",
          failedEmails,
          dbErrors,
        },
        { status: 207 } // Multi-status response
      );
    }

    // Return success response
    return NextResponse.json({ success: "All operations completed successfully", data: storage }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
