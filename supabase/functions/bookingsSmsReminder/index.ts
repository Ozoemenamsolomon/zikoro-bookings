// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
 
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

// initialize supabase
//@ts-ignore
const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// @ts-ignore
const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// @ts-ignore
const TERMII_API_KEY = Deno.env.get("_TERMII_API_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseKey);

// @ts-ignore
Deno.serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }
 
        // Get the current date
        const now = new Date();

        // Get tomorrow's date (start of the day at 00:00:00)
        const formattedTomorrow = new Date(now);
        formattedTomorrow.setDate(now.getDate() + 1);
        formattedTomorrow.setHours(0, 0, 0, 0);

        // Get the day after tomorrow (start of the day at 00:00:00)
        const formattedDayAfterTomorrow = new Date(formattedTomorrow);
        formattedDayAfterTomorrow.setDate(formattedTomorrow.getDate() + 1);

        // Fetch pending reminders for the next calendar day
        const { data, error } = await supabase
          .from("bookingReminders")
          .select(`*, bookingId!inner(id, bookingStatus)`)
          .eq("smsStatus", "PENDING")
          .neq("bookingId.bookingStatus", "CANCELLED")
          .gte("sendAt", formattedTomorrow.toISOString() ) // Start of tomorrow (00:00)
          .lt("sendAt", formattedDayAfterTomorrow.toISOString() ); // Before the day after (00:00)

        if (error) {
            console.error("Error fetching reminders:", error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response("No reminders to send", { status: 200 });
        } else {
              let smsResponse:SmsReminderResult[] = []; 
              const groupedSmsData = groupBookingReminders(data) 
        
              try {
                smsResponse = await sendSmsConcurrently(groupedSmsData);
              } catch (err) {
                console.error("Global email send error:", err);
                // Fallback error for all
                smsResponse = data.map((reminder:SmsReminderResult) => ({
                  id: reminder.id,
                  phone: reminder.phone!,
                  status: "REJECTED",
                  message: "Unhandled error occurred while sending emails",
                }));
              }
        
              const result = await updateSmsStatus(smsResponse);
              return new Response(JSON.stringify({ 
                success: "SMS Reminders processed", 
                smsResponse,  
                // groupedSmsData,
                result 
              }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
            } 
    } catch (err) {
        console.error("Function error:", err);
        // @ts-ignore
        return new Response(JSON.stringify({ error: "Internal Server Error", err }), { status: 500 });
    }
});

export type SmsPayload = {
  to: string;
  from: string;
  sms: string;
  type: string;
  // type: 'plain' | 'unicode';
  api_key: string;
  channel: string;
  media?: {
    url: string;
    caption: string;
  };
};
export async function sendTSms(payload: SmsPayload) {
  try {
    const response = await fetch('https://v3.api.termii.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send SMS: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('SMS sent successfully: ', data);
    return data;
  } catch (error) {
    console.error('Error sending SMS: ', error);
    throw error;
  }
}

type SmsReminderResult = {
  id: number;
  phone: string;
  status: "FULFILLED" | "REJECTED";
  message: string;
  smscost?:string|null,
  smsLength?: number|null,
};

const sendSmsConcurrently = async (
  groupedReminders: { id: number; message: string; phone: string; sendAt: string }[]
): Promise<SmsReminderResult[]> => {
  const smsPromises = groupedReminders.map(({ id, phone, message }) => {
    return {
      id,
      phone,
      // promise: sendSms(phone, message),
      promise: sendTSms({
        to: phone,
        from: 'ZIKORO',
        sms: message,
        type: 'plain',
        api_key: TERMII_API_KEY as string,
        channel: 'generic',
      }),
    };
  });

  const results = await Promise.allSettled(smsPromises.map((item) => item.promise));

  const structured: SmsReminderResult[] = await Promise.all(
    results.map(async (result, index) => {
      const { id, phone } = smsPromises[index];

      if (result.status === "fulfilled") {
        try {
          const data = result.value;

        //   const {
        //     "code": "ok",
        //     "balance": 7,
        //     "message_id": "3017446512409948542771580",
        //     "message": "Successfully Sent",
        //     "user": "Onyekachi Ozoemenam",
        //     "message_id_str": "3017446512409948542771580"
        // }

          // Handle the response format
          if (data.code === "ok") {
            return {
              id,
              phone: phone,
              status: "FULFILLED",
              message: data.message || "SMS sent successfully",
              smscost: '3',
              smsLength: Number(data?.message?.length) || null,
            };
          } else {
            return {
              id,
              phone: phone,
              status: "REJECTED",
              message: data.message || "SMS failed with an unknown error",
            };
          }
        } catch (error) {
          return {
            id,
            phone: phone,
            status: "REJECTED",
            message: "SMS sent but Unhandled error",
          };
        }
      }

      return {
        id,
        phone: phone,
        status: "REJECTED",
        message: result.reason?.message || "Failed to send SMS",
      };
    })
  );

  return structured;
};

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

type GroupBookingReminder = {
    id:number,
    message: string,
    phone: string,
    sendAt:string,
}

const groupBookingReminders = (smsReminders: BookingReminder[]): GroupBookingReminder[] => {
  const seen = new Set<string>();  // To track already processed (phone, sendAt) pairs
  const result: { id: number; message: string; phone: string; sendAt: string }[] = [];

  for (const { bookingId, phone, smsMessage, id, sendAt } of smsReminders) {
    if (!id || !phone || !smsMessage || !sendAt) continue;

    const normalizedPhone = normalizePhoneNumber(phone); // Normalize phone number
    const key = `${normalizedPhone}-${sendAt}`;  // Unique key to check duplicates

    // Skip if the (phone, sendAt) pair has already been processed
    if (seen.has(key)) continue;

    // Mark this pair as processed
    seen.add(key);

    // Add the unique entry to the result list
    result.push({
      id,
      message: smsMessage,
      phone: normalizedPhone,
      sendAt,
    });
  }

  return result;
};

const updateSmsStatus = async (smsResponses: SmsReminderResult[]) => {
   // Batch update in parallel
   const updatePromises = smsResponses.map(({phone,id,status,message,smscost, smsLength,}) =>
    supabase
      .from("bookingReminders")
      .update({
        smsStatus: status,
        smsStatusMessage: message,
        smscost, smsLength,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, smsStatus, updatedAt, smsStatusMessage, smscost, smsLength')
      .single()
  );

  const results = await Promise.allSettled(updatePromises);
  return results
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

// supabase functions new function-name  
// supabase functions deploy bookingsSmsReminder --project-ref ddlepujpbqjoogkmiwfu
//  export SUPABASE_ACCESS_TOKEN="sbp_02b68a015bee083fd8c48422d26384407fea3084"   

