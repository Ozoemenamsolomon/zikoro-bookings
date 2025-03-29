// // // Follow this setup guide to integrate the Deno language server with your editor:
// // // https://deno.land/manual/getting_started/setup_your_environment
// // // This enables autocomplete, go to definition, etc.

// // // Setup type definitions for built-in Supabase Runtime APIs
// // import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// // // @ts-ignore
// // import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

// // // Initialize Supabase
// // // @ts-ignore
// // const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// // // @ts-ignore
// // const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// // // @ts-ignore
// // const zeptoApiKey = Deno.env.get("_ZEPTOMAIL_API_TOKEN") as string;
// // // @ts-ignore
// // const senderEmail = Deno.env.get("_SENDER_EMAIL") as string;

// // const supabase = createClient(supabaseUrl, supabaseKey);

// // function formatDateWithOffset(date: Date) {
// //   const offset = date.getTimezoneOffset();
// //   const sign = offset > 0 ? "-" : "+";
// //   const absOffset = Math.abs(offset);
// //   const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
// //   const minutes = String(absOffset % 60).padStart(2, "0");
// //   return date.toISOString().replace("Z", `${sign}${hours}:${minutes}`);
// // }

// // // @ts-ignore
// // Deno.serve(async (req) => {
// //   try {
// //     // const twoHoursAgo = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
// //     // const { data: users, error } = await supabase
// //     //   .from("organization")
// //     //   .select("id")
// //     //   .gte("created_at", new Date('Wed, 26 Feb 2025 11:36:48 GMT').toISOString())
// //     //   // .eq("welcome_email_sent", false);

// //     // if (error) throw error;

// //     // for (const user of users) {
// //     //   const mailBody = `
// //     //     <div style="background-color: #f4f4f4; padding: 20px;">
// //     //       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
// //     //         <tr><td align="center">
// //     //           <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1740654461/logo_rogdwe.webp" alt="Company Logo" width="150" style="margin-bottom: 20px;">
// //     //         </td></tr>
// //     //         <tr><td align="center">
// //     //           <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; text-align: start;">
// //     //             <p style="color: #555;">Hi ${user?.firstName},</p>
// //     //             <p style="color: #555; margin-top: 20px; margin-bottom: 20px;">
// //     //               We’re thrilled to have you on Zikoro! Here’s how you can get started right away:
// //     //             </p>
// //     //             <p>✅ Create and sell event/workshop tickets: <a href="https://zikoro.com">Get Started</a></p>
// //     //             <p>✅ Issue digital certificates: <a href="https://credentials.zikoro.com">Get Started</a></p>
// //     //             <p>✅ Simplify your appointments: <a href="https://bookings.zikoro.com">Get Started</a></p>
// //     //             <p>Want to optimize your business? 📲 WhatsApp us at <a href="https://wa.me/+2347041497076">+2347041497076</a>!</p>
// //     //             <p>Best Regards,</p>
// //     //             <p>The Zikoro Team</p>
// //     //           </div>
// //     //         </td></tr>
// //     //       </table>
// //     //     </div>`;

// //     //   const emailResponse = await fetch("https://api.zeptomail.com/v1.1/email", {
// //     //     method: "POST",
// //     //     headers: {
// //     //       "Content-Type": "application/json",
// //     //       Authorization: zeptoApiKey,
// //     //     },
// //     //     body: JSON.stringify({
// //     //       from: { address: senderEmail, name: "Zikoro" },
// //     //       to: [{ email_address: { address: user?.userEmail, name: user?.firstName } }],
// //     //       subject: "Welcome to Zikoro! Let’s Get Started 🚀",
// //     //       htmlbody: mailBody,
// //     //     }),
// //     //   });

// //       // if (!emailResponse.ok) {
// //       //   throw new Error(`Failed to send email: ${await emailResponse.text()}`);
// //       // }

// //       // await supabase.from("users").update({ welcome_email_sent: true }).eq("id", user.id);
// //     // }
// //     return new Response(
// //       JSON.stringify('users'),
// //       { headers: { "Content-Type": "application/json" } },
// //     )
// //     // return new Response(JSON.stringify(users), { status: 200 });
// //   } catch (error) {
// //     const errorMessage = error instanceof Error ? error.message : String(error); 
// //     console.error("Error in function:", errorMessage);
// //     return new Response(`Error: ${errorMessage}`, { status: 500 });  }
// // });


// // /* To invoke locally:
// //   1. Run supabase start (see: https://supabase.com/docs/reference/cli/supabase-start)
// //   2. Make an HTTP request:
// // curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/testingEmail' \
// //     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
// //     --header 'Content-Type: application/json' 
//     // --data '{"name":"Emma Udeji"}'
// // */



// // /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// // console.log("Hello from Functions!")

// // Deno.serve(async (req) => {
// //   const { name } = await req.json()
// //   const data = {
// //     message: `Hello ${name}!`,
// //   }

// //   return new Response(
// //     JSON.stringify(data),
// //     { headers: { "Content-Type": "application/json" } },
// //   )
// // })

// /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// const supabase = createClient(supabaseUrl, supabaseKey);

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name, g } = await req.json()
//   // const { data, error } = await supabase
//   //       .from('organization')
//   //       .select("*")
//   //       .eq("id":147)
//         // .gte("created_at", new Date('Wed, 26 Feb 2025 11:36:48 GMT').toISOString())
//   // console.log({ data, error })
//   const data = {
//     message: `Hello ${name + " " + g}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })



// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

// const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// const supabase = createClient(supabaseUrl, supabaseKey);

// console.log("Hello from Functions!")

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

const KUDISMS_API_KEY="tjwRx5iS6JMGnU749FBDAh3Nbd1KceYWsZLTIkXCfzVrmPHlpOQoqEyv0au8g2"
const KUDISMS_SENDER_ID="Zikoro"

const supabase = createClient(supabaseUrl, supabaseKey);

const MAX_RETRY_ATTEMPTS = 3;

async function sendSms(recipients: string, message: string) {
  try {
    const url = `https://my.kudisms.net/api/sms?token=${KUDISMS_API_KEY}&senderID=${KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;
    const data = new FormData();
    data.append("token", KUDISMS_API_KEY as string);
    data.append("senderID", KUDISMS_SENDER_ID as string);
    data.append("recipients", recipients);
    data.append("message", message);
    data.append("gateway", "2");

    const response = await fetch(url, {
      method: "POST",
      body: data, 
    });

    if (!response.ok) {
      throw new Error(`Failed to send SMS: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log({ responseData, data });

    return responseData;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Deno.serve(async (req) => {
//   try {
//       if (req.method !== "POST") {
//           return new Response("Method Not Allowed", { status: 405 });
//       }

//       const smsResponse = await sendSms('2348032787601', `From the edge function testing`);

//       return new Response(JSON.stringify({ success: "SMS Reminders processed", smsResponse }), {
//           status: 200,
//           headers: { "Content-Type": "application/json" },
//       });

//   } catch (error) {
//       console.error("Function error:", error);
//       return new Response(JSON.stringify({ error: "Internal Server Error", errorMsg:error?.message }), { status: 500 });
//   }
// });

// @ts-ignore
Deno.serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        const now = new Date();
        const time24HoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const time25HoursFromNow = new Date(now.getTime() + 25 * 60 * 60 * 1000);
        
        // Function to format date to YYYY-MM-DD (valid SQL DATE format)
        function formatDateToYYYYMMDD(date: Date): string {
          return date.toISOString().slice(0, 10); // Extracts only YYYY-MM-DD
        }
        
        const formattedTime24 = formatDateToYYYYMMDD(time24HoursFromNow);
        const formattedTime25 = formatDateToYYYYMMDD(time25HoursFromNow);

        // Fetch pending reminders
        const { data, error } = await supabase
            .from("bookings")
            .select("id, phone,  appointmentLinkId(id, smsNotification)")
            .eq("appointmentLinkId.smsNotification", "PENDING")
            // .lte("appointmentDate", formattedTime25)
            // .gte("appointmentDate", formattedTime24);

        if (error) {
            console.error("Error fetching reminders:", error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response("No reminders to send", { status: 200 });
        }

        // Prepare message
        const message = "Reminder: Your appointment is scheduled within the next 24 hours.";
        // @ts-ignore
        const recipients = data.map(({ phone }) => phone).join(", ");

        // Send SMS
        // const smsResponse = await sendSms(recipients, message);

        // Update status in appointmentLink
        const appointmentIds = [...new Set(data.map(d => d.appointmentLinkId?.id).filter(id => id))];

        let updateStatus = "No updates made";
        
        if (appointmentIds.length > 0) {
            const { error: updateError } = await supabase
                .from("appointmentLinks")
                .update({ smsNotification: "SENT" })
                .in("id", appointmentIds);

            updateStatus = updateError ? updateError.message : "Status updated to SENT";
        }

        return new Response(JSON.stringify({ success: "SMS Reminders processed", updateStatus,  appointmentIds, recipients, data }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Function error:", error);
        // @ts-ignore
        return new Response(JSON.stringify({ error: "Internal Server Error", errorMsg:error?.message }), { status: 500 });
    }
});




/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/testingEmail' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Emma Udeji"}'

  // @ts-ignore
  const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
  // @ts-ignore
  const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
  // @ts-ignore
  const zeptoApiKey = Deno.env.get("_ZEPTOMAIL_API_TOKEN") as string;
  // @ts-ignore
  const senderEmail = Deno.env.get("_SENDER_EMAIL") as string;

  const KUDI_SMS_API = Deno.env.get("_KUDI_SMS_API");
  const KUDISMS_SENDER_ID = Deno.env.get("KUDISMS_SENDER_ID");


  const supabaseUrl = "https://ddlepujpbqjoogkmiwfu.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkbGVwdWpwYnFqb29na21pd2Z1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTYwNjQ5NCwiZXhwIjoyMDE3MTgyNDk0fQ.Z4cc23CFZ8Ra7YLsphgvbEW6d_nrOKKCmYao6sA7_Jc"
  const zeptoApiKey = "Zoho-enczapikey wSsVR61380X1W60symCrIr87mg9QVA6nRkx42FSo6Sf9F/jCosc8lUzOAVWkHaQfQmdhFDARo7oqnBYE1DVY3dh7m1AEDSiF9mqRe1U4J3x17qnvhDzOV2lfmxqJK44NxwpinWdgGs4k+g=="
  const senderEmail = "support@zikoro.com"


*/


/*

const { data, error } = await supabase
.from("sms_reminders")
.select("id, phone_number, message, retry_count")
.or("status.eq.PENDING,status.eq.FAILED") // Fetch both pending and failed
.lte("appointment_time", new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString())
.gte("appointment_time", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
.lte("retry_count", MAX_RETRY_ATTEMPTS) // Ensure we don’t retry indefinitely
.limit(1000); // Batch size

    const updatePromises = data.map(async (reminder, index) => {
      const success = smsResponse[index]?.success;
      const newStatus = success ? "SENT" : "FAILED";
      const newRetryCount = success ? reminder.retry_count : reminder.retry_count + 1;

      return supabase
        .from("sms_reminders")
        .update({ status: newStatus, retry_count: newRetryCount, last_attempt: new Date().toISOString() })
        .eq("id", reminder.id);
    });

    await Promise.all(updatePromises);



interface SmsReminder {
  id: string; // Unique identifier
  phone_number: string; // Recipient's phone number
  message: string; // SMS message content
  status: "PENDING" | "SENT" | "FAILED"; // Current status of the SMS
  appointment_time: string; // ISO string of the appointment time
  retry_count: number; // Number of retry attempts
  last_attempt?: string; // ISO string of the last attempt timestamp (optional)
  created_at: string; // Timestamp when the reminder was created
}



*/