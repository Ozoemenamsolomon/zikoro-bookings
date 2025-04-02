// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
 
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

// initialize supabase
// const supabaseUrl = "https://ddlepujpbqjoogkmiwfu.supabase.co"
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGVwdWpwYnFqb29na21pd2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTYwNjQ5NCwiZXhwIjoyMDE3MTgyNDk0fQ.Z4cc23CFZ8Ra7YLsphgvbEW6d_nrOKKCmYao6sA7_Jc"

// const KUDISMS_API_KEY="tjwRx5iS6JMGnU749FBDAh3Nbd1KceYWsZLTIkXCfzVrmPHlpOQoqEyv0au8g2"
// const KUDISMS_SENDER_ID="Zikoro"

const supabase = createClient(supabaseUrl, supabaseKey);

// @ts-ignore
Deno.serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        const now = new Date();
        const formattedTomorrow = new Date(now);
        formattedTomorrow.setDate(now.getDate() + 1);
        formattedTomorrow.setHours(0, 0, 0, 0);
        
        const formattedDayAfterTomorrow = new Date(formattedTomorrow);
        formattedDayAfterTomorrow.setDate(formattedTomorrow.getDate() + 1);

        // Fetch pending email reminders
        const { data, error } = await supabase
            .from("bookingReminders")
            .select(`*, bookingId!inner(id, appointmentLinkId!inner(id, emailNotification, locationDetails))`)
            .eq("emailStatus", "PENDING")
            .gte("sendAt", formattedTomorrow)
            .lt("sendAt", formattedDayAfterTomorrow);

        if (error) {
            console.error("Error fetching email reminders:", error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response("No email reminders to send", { status: 200 });
        }

        // Send Emails
        let emailResponse = []; // Array to store [{bookingId, response}]
        const groupedEmailData = groupEmailReminders(data);

        for (const [bookingId, { message, recipients }] of groupedEmailData.entries()) {
            if (recipients.length > 0) {
                // Send email
                const response = await sendEmail(recipients, 'Appointment Reminder', message,);
                emailResponse.push({ bookingId, response });
            }
        }

        // Update email status in bookingReminders
        await updateEmailStatus(emailResponse, groupedEmailData);

        return new Response(JSON.stringify({
            success: "Email Reminders processed",
            emailResponse,
            groupedEmailData,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Function error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error", err}), { status: 500 });
    }
});

const groupEmailReminders = (emailReminders: BookingReminder[]) => {
    const groupedData = new Map<string, { message: string; recipients: string[] }>();

    for (const { bookingId, email, emailMessage } of emailReminders) {
        const id = String(bookingId);
        if (!bookingId || !email || !emailMessage) continue;

        if (!groupedData.has(id)) {
            groupedData.set(id, { message: emailMessage, recipients: [] });
        }

        const group = groupedData.get(id)!;

        if (!group.recipients.includes(email)) {
            group.recipients.push(email);
        }
    }

    return groupedData;
};

import { SendMailClient } from 'zeptomail';
 
const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
});

const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
const senderName = "Zikoro";

export const sendEmail = async (recipients: string[], subject: string, htmlBody: string, ) => {
  try {
    const response = await client.sendMail({
      from: {
        address: senderAddress,
        name: senderName,
      },
      to: recipients.map(email => ({
        email_address: {
          address: email.trim(),
          name: "Attendee",
        },
      })),
      subject,
      htmlbody: htmlBody,
      // attachments: [
      //   {
      //     name: 'appointment.ics',
      //     content: Buffer.from(icsContent).toString('base64'),
      //     mime_type: 'text/calendar',
      //   },
      // ],
    });
 
    return response;
  } catch (error) {
    console.error("Error sending bulk email:", error);
    throw error;
  }
};

const updateEmailStatus = async (emailResponses: { bookingId: string; response: any }[], groupedEmailData: Map<string, { message: string; recipients: string[] }>) => {
    const updates: { bookingId: number; email: string; emailStatus: string }[] = [];

    emailResponses.forEach(({ bookingId, response }) => {
        const { status, data } = response;

        if (status !== "success" || !data) {
            const group = groupedEmailData.get(bookingId);
            if (group) {
                group.recipients.forEach((email) => {
                    updates.push({
                        bookingId: Number(bookingId),
                        email,
                        emailStatus: "FAILED",
                    });
                });
            }
            return;
        }

        const deliveredEmails = new Set<string>();

        data.forEach((entry: string) => {
            if (entry) deliveredEmails.add(entry);
        });

        const group = groupedEmailData.get(bookingId);
        if (group) {
            group.recipients.forEach((email) => {
                const emailStatus = deliveredEmails.has(email) ? "SENT" : "FAILED";
                updates.push({
                    bookingId: Number(bookingId),
                    email,
                    emailStatus,
                });
            });
        }
    });

    const updatePromises = updates.map((update) =>
        supabase
            .from("bookingReminder")
            .update({ emailStatus: update.emailStatus })
            .match({ bookingId: update.bookingId, email: update.email })
    );

    const results = await Promise.all(updatePromises);
    console.log(results);
    return results;
};

interface BookingReminder {
  id: bigint; // UUID (Primary Key)
  bookingId: bigint; // UUID (Foreign Key) - Links to appointments
  phone?: string; // Attendee's phone number (Optional)
  email?: string; // Attendee's email (Optional)
  smsMessage: string; // SMS message content
  emailMessage: string; // Email message content
  sendAt: string; // TIMESTAMP - Scheduled send time (ISO string)
  smsStatus: 'PENDING' | 'SENT' | 'FAILED'; // ENUM - SMS reminder status
  emailStatus: 'PENDING' | 'SENT' | 'FAILED'; // ENUM - Email reminder status
  createdAt: string; // TIMESTAMP - Record creation timestamp (ISO string)
  updatedAt: string; // TIMESTAMP - Last update timestamp (ISO string)
}





// Deno.serve(async (req) => {
//   const { name } = await req.json()
//   const data = {
//     message: `Hello ${name}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/bookingEmailReminder' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
