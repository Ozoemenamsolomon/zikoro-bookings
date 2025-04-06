// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
 
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

// initialize supabase
const supabaseUrl = "https://ddlepujpbqjoogkmiwfu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGVwdWpwYnFqb29na21pd2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTYwNjQ5NCwiZXhwIjoyMDE3MTgyNDk0fQ.Z4cc23CFZ8Ra7YLsphgvbEW6d_nrOKKCmYao6sA7_Jc"

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
            .select(`*, bookingId(id, bookingStatus)`)
            .eq("emailStatus", "PENDING")
            .neq("bookingId.bookingStatus", "CANCELLED")
            .gte("sendAt", formattedTomorrow.toISOString())
            .lt("sendAt", formattedDayAfterTomorrow.toISOString());

        if (error) {
            console.error("Error fetching email reminders:", error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response("No email reminders to send", { status: 200 });
        } else {
            let emailResponses: EmailReminderResult[] = [];
            const emailBookings = data.filter((b:BookingReminder) => !!b.email);

            try {
            emailResponses = await sendEmailsConcurrently(emailBookings);
            } catch (err) {
            console.error("Global email send error:", err);
            // Fallback error for all
            emailResponses = data.map((reminder:BookingReminder) => ({
                id: reminder.id,
                email: reminder.email!,
                status: "REJECTED",
                message: "Unhandled error occurred while sending emails",
              }));
            }

            const result = await updateEmailStatus(emailResponses);
            
            return new Response(JSON.stringify( {
                success: "Email Reminders processed",
                // emailResponses,
                // data,
                dbUdateResult:result
            } ), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }); 
        }  
    } catch (err) {
        console.error("Function error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error", err}), { status: 500 });
    }
});


const zeptoApiKey = "Zoho-enczapikey wSsVR61380X1W60symCrIr87mg9QVA6nRkx42FSo6Sf9F/jCosc8lUzOAVWkHaQfQmdhFDARo7oqnBYE1DVY3dh7m1AEDSiF9mqRe1U4J3x17qnvhDzOV2lfmxqJK44NxwpinWdgGs4k+g==";
const senderEmail = "support@zikoro.com";

const senderName = "Zikoro";

type EmailReminderResult = {
  email: string;
  id: number;
  status: "FULFILLED" | "REJECTED";
  message: string;
};

export const sendEmailsConcurrently = async (
  bookings: BookingReminder[]
): Promise<EmailReminderResult[]> => {
  const emailPromises = bookings.map(({ email, emailMessage, id }) => {
    return {
      id,
      email,
      promise: fetch("https://api.zeptomail.com/v1.1/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: zeptoApiKey,
        },
        body: JSON.stringify({
          from: {
            address: senderEmail,
            name: senderName,
          },
          to: [
            {
              email_address: {
                address: email!.trim(),
                name: "Attendee",
              },
            },
          ],
          subject: "Appointment Reminder",
          htmlbody: emailMessage,
        }),
      }),
    };
  });

  const results = await Promise.allSettled(
    emailPromises.map((item) => item.promise)
  );

  const structured: EmailReminderResult[] = await Promise.all(
    results.map(async (result, index) => {
      const { id, email } = emailPromises[index];

      if (result.status === "fulfilled") {
        try {
          const data = await result.value.json();
          const message =
            data?.message || data?.data?.[0]?.message || "Email sent";

          return {
            id,
            email: email! || "",
            status: "FULFILLED",
            message,
          };
        } catch (error) {
          return {
            id,
            email: email! || "",
            status: "REJECTED",
            message: "Email sent but failed to parse response",
          };
        }
      }

      return {
        id,
        email: email! || "",
        status: "REJECTED",
        message: result.reason?.message || "Failed to send email",
      };
    })
  );

  return structured;
};


const updateEmailStatus = async (
  emailResponses: EmailReminderResult[],
) => {
 
  // Batch update in parallel
  const updatePromises = emailResponses.map(({email,id,status,message}) =>
    supabase
      .from("bookingReminders")
      .update({
        emailStatus: status,
        emailStatusMessage: message,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select('id,updatedAt')
      .single()
  );

  const results = await Promise.allSettled(updatePromises);
  // console.log({results});
  return results;
};

interface BookingReminder {
  id: number; // UUID (Primary Key)
  bookingId: number; // UUID (Foreign Key) - Links to appointments
  phone?: string | null;
  email?: string | null;
  smsMessage?: string | null;
  emailMessage?: string | null;
  smsStatus?: string | null;
  emailStatus?: string | null;
  emailReminderStatus?: string | null;
  recordCreationTimeStamp?: string | null;
  updatedAt?: string | null;
  lastUpdateTimestamp?: string | null;
  scheduledSendTime?: string | null;
  sendAt?: string | null;
}



// _ZEPTO_URL="https://api.zeptomail.com"
// _SENDER_EMAIL="support@zikoro.com"
// _EMAIL_PASSWORD= "zPjy5gs@"
// _ZEPTO_TOKEN="Zoho-enczapikey wSsVR61380X1W60symCrIr87mg9QVA6nRkx42FSo6Sf9F/jCosc8lUzOAVWkHaQfQmdhFDARo7oqnBYE1DVY3dh7m1AEDSiF9mqRe1U4J3x17qnvhDzOV2lfmxqJK44NxwpinWdgGs4k+g=="

// _SITE_URL="https://bookings.zikoro.com/"
// # NEXT_PUBLIC_ZEPTO_URL=api.zeptomail.com/

// _KUDISMS_API_KEY="tjwRx5iS6JMGnU749FBDAh3Nbd1KceYWsZLTIkXCfzVrmPHlpOQoqEyv0au8g2"
// _KUDISMS_SENDER_ID="Zikoro"

// _SUPABASE_URL=https://ddlepujpbqjoogkmiwfu.supabase.co
// _SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGVwdWpwYnFqb29na21pd2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTYwNjQ5NCwiZXhwIjoyMDE3MTgyNDk0fQ.Z4cc23CFZ8Ra7YLsphgvbEW6d_nrOKKCmYao6sA7_Jc




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
