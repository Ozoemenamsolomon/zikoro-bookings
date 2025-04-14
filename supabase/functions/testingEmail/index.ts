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

// const MAX_RETRY_ATTEMPTS = 3;

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
                  .select(`id, phone, appointmentDate, appointmentTime, appointmentName, participantEmail,firstName,lastName, appointmentLinkId!inner(id, smsNotification, locationDetails)`)
                  .eq('appointmentLinkId.smsNotification', "PENDING")
                  .lte("appointmentDate", formattedTime25)
                  .gte("appointmentDate", formattedTime24);

        if (error) {
            console.error("Error fetching reminders:", error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response("No reminders to send", { status: 200 });
        }

        // Send SMS
        let smsResponse = []
        const groupedSmsData = groupBookingsForSms(data) 
          
        // for (const [appointmentLinkId, { formattedMsg, recipients }] of groupedSmsData) {
        //   const res = await sendSms(recipients.join(", "), formattedMsg);
        //   smsResponse.push(res)
        // }

        // Update status in appointmentLink
        // @ts-ignore
        const appointmentIds = [...new Set(data.map(d => d.appointmentLinkId?.id).filter(id => id))];

        let updateStatus = "No updates made";
        
        // if (appointmentIds.length > 0) {
        //     const { error: updateError } = await supabase
        //         .from("appointmentLinks")
        //         .update({ smsNotification: "SENT" })
        //         .in("id", appointmentIds);

        //     updateStatus = updateError ? updateError.message : "Status updated to SENT";
        // }

        return new Response(JSON.stringify({ success: "SMS Reminders processed",  groupedSmsData }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Function error:", error);
        // @ts-ignore
        return new Response(JSON.stringify({ error: "Internal Server Error", error }), { status: 500 });
    }
});

function normalizePhoneNumber(phone: string): string {
  // Remove non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Convert local format (0803...) to international format (234803...)
  if (cleaned.startsWith("0") && cleaned.length === 11) {
      cleaned = "234" + cleaned.slice(1);
  } else if (cleaned.startsWith("234") && cleaned.length === 13) {
      cleaned = "234" + cleaned.slice(3);
  }

  return cleaned;
}

function formatAppointmentDate(appointmentDate: string, appointmentTime: string) {
  const date = new Date(appointmentDate);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getDate()} at ${appointmentTime}`;
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

function groupBookingsForSms(bookings: any[]) {
  const groupedData = new Map<
      string,
      { formattedMsg: string; recipients: string[] }
  >();

  bookings.forEach((booking) => {
      const {
          appointmentLinkId,
          phone,
          appointmentDate,
          appointmentTime,
          appointmentName,
          appointmentLinkId: { locationDetails },
      } = booking;

      if (!appointmentLinkId?.id || !phone) return;

      // Normalize phone number
      const normalizedPhone = normalizePhoneNumber(phone);

      // Format date to avoid blocked messages
      const formattedDate = formatAppointmentDate(appointmentDate, appointmentTime);

      // Truncate location details
      const shortLocation = truncateText(locationDetails, 30);

      if (!groupedData.has(appointmentLinkId.id)) {
          const formattedMsg = `Hello, you have an appointment: "${appointmentName}" on ${formattedDate}. Location: ${shortLocation}. Please be on time.`;
          groupedData.set(appointmentLinkId.id, { formattedMsg, recipients: [] });
      }

      const group = groupedData.get(appointmentLinkId.id)!;

      // Ensure phone numbers are unique
      if (!group.recipients.includes(normalizedPhone)) {
          group.recipients.push(normalizedPhone);
      }
  });

  return groupedData;
}

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


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/bookingsSmsReminder' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Udeji"}'

POSSIBLE LIVE URL
    curl -i --location --request POST 'https://ddlepujpbqjoogkmiwfu.supabase.co/functions/v1/bookingsSmsReminder' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json'

*/
