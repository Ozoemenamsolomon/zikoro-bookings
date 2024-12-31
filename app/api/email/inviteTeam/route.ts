import { generateBookingICS } from "@/lib/generateICS";
import { mergeEmailLists } from "@/lib/mergeEmails";
import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from 'zeptomail';
import jwt from 'jsonwebtoken';

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
    { expiresIn: '5d' }
  );
}

// Helper function to generate email body
function generateEmailBody(email: string, workspaceName: string, role: string, workspaceAlias: string, baseUrl: string): string {
  const token = generateInviteToken(email, workspaceName, role, workspaceAlias);
  const inviteLink = `${baseUrl}?token=${token}`;
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

    if (!emails?.length || !role || !workspaceName || !workspaceAlias) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const baseUrl = `${req.headers.get('origin') || 'http://localhost:3000'}`;
    const subject = `Invitation to join the ${workspaceName} team.`;
    const failedEmails: string[] = [];
 

    for (const email of emails) {
      try {
        if (!email || typeof email !== 'string') {
          console.warn(`Invalid email encountered: ${email}`);
          failedEmails.push(email);
          continue;
        }
        const htmlBody = generateEmailBody(email, workspaceName, role, workspaceAlias, baseUrl);
        const response = await client.sendMail({
          from: {
            address: senderAddress,
            name: senderName,
          },
          to: [{
            email_address: {
              address: email,
              name: "TeamMember",
            },
          }],
          subject,
          htmlbody: htmlBody,
        });
        // console.log('=====', response)
        if(response?.message !== 'OK'){
          failedEmails.push(email);
        }
         
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        failedEmails.push(email);
      }
    }

    // console.log({ results });

    if (failedEmails.length > 0) {
      return NextResponse.json(
        { message: `Some emails failed to send ${failedEmails.join(', ')}`, msg:'failed' },
        { status: 207 }
      );
    }

    return NextResponse.json({ message: 'All emails sent successfully',}, { status: 200 });
  } catch (error) {
    console.error("Unhandled error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
