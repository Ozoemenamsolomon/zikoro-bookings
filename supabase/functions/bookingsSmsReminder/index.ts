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
          .select(`*, bookingId!inner(id, appointmentLinkId!inner(id, smsNotification, locationDetails))`)
          .eq("smsStatus", "PENDING")
          .gte("sendAt", formattedTomorrow) // Start of tomorrow (00:00)
          .lt("sendAt", formattedDayAfterTomorrow); // Before the day after (00:00)

        if (error) {
            console.error("Error fetching reminders:", error);
            return new Response(JSON.stringify({ error }), { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response("No reminders to send", { status: 200 });
        }

        // Send SMS
        let smsResponse = [] // this should form [{bookingId, response:smsResponse}]
        const groupedSmsData = groupBookingReminders(data) 
          
         // Iterate over each grouped data in the Map
          for (const [bookingId, { message, recipients }] of groupedSmsData.entries()) {
            if (recipients.length > 0) {
              // Send SMS and store the response
              const response = await sendSms(recipients.join(","), message);

              // Push the response with corresponding bookingId to the array
              smsResponse.push({ bookingId, response });
            }
          }

        // Update status in bookingReminders
        // @ts-ignore
        await updateSmsStatus(smsResponse, groupedSmsData)
         
        return new Response(JSON.stringify({ success: "SMS Reminders processed", smsResponse,  groupedSmsData,   }), {
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

const groupBookingReminders = (smsReminders: BookingReminder[]) => {
  const groupedData = new Map<string, { message: string; recipients: string[] }>();

  for (const { bookingId, phone, smsMessage } of smsReminders) {
    const id = String(bookingId.id)
    if (!bookingId || !phone || !smsMessage) continue;

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!groupedData.has(id)) {
      groupedData.set((id), { message: smsMessage, recipients: [] });
    }

    const group = groupedData.get(id)!;

    if (!group.recipients.includes(normalizedPhone)) {
      group.recipients.push(normalizedPhone);
    }
  }

  return groupedData;
};

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

const updateSmsStatus = async (smsResponses: { bookingId: string; response: any }[], groupedSmsData: Map<string, { message: string; recipients: string[] }>) => {
  const updates: { bookingId: number; phone: string; smsStatus: string }[] = [];

  // Iterate over each smsResponse entry
  smsResponses.forEach(({ bookingId, response }) => {
    const { status, data } = response;

    // Skip if the status is not "success" or there is no data
    if (status !== "success" || !data) {
      // If the status is not success, we directly mark all recipients as FAILED
      const group = groupedSmsData.get(bookingId);
      if (group) {
        group.recipients.forEach((phone) => {
          updates.push({
            bookingId:Number(bookingId),
            phone,
            smsStatus: "FAILED", // Mark as FAILED
          });
        });
      }
      return;
    }

    // Track delivered phones (phones that received the message successfully)
    const deliveredPhones = new Set<string>();
    
    // Extract phone numbers from the response data
    data.forEach((entry: string) => {
      const [phone] = entry.split("|"); // We only care about the phone number
      if (phone) deliveredPhones.add(phone); // Add to delivered phones set
    });

    // Iterate over the recipients for the current bookingId
    const group = groupedSmsData.get(bookingId);
    if (group) {
      group.recipients.forEach((phone) => {
        // If the phone was not delivered, mark it as FAILED
        const smsStatus = deliveredPhones.has(phone) ? "SENT" : "FAILED";
        updates.push({
          bookingId:Number(bookingId),
          phone,
          smsStatus, // If deliveredPhone exists, it's SENT, otherwise FAILED
        });
      });
    }
  });

  // Bulk update in Supabase
  const updatePromises = updates.map((update) =>
    supabase
      .from("bookingReminder")
      .update({ smsStatus: update.smsStatus })
      .match({ bookingId: update.bookingId, phone: update.phone })
  );

  const results = await Promise.all(updatePromises);

  console.log(results)

  return results
};

interface BookingReminder {
  id: bigint; // UUID (Primary Key)
  bookingId: Booking; // UUID (Foreign Key) - Links to appointments
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

interface Booking {
  id?: bigint;
  created_at?: string;
  address?:string;
  appointmentLinkId?: AppointmentLink;
  participantEmail?: string;
  appointmentDate?: Date | string | null;
  appointmentTime?: string | null;
  scheduleColour?: string | null;
  teamMembers?: string | null;
  appointmentType?: string | null;
  appointmentName?: string | null;
  bookingStatus?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  price?: number |string| null;
  createdBy?: any;
  email?:string;
  currency?: string | null;
  feeType?: string | null;
  notes?: string | null;
  categoryNote?: string | null;
  appointmentTimeStr?: string;
  appointmentDuration?: number;
  type?: string;
  reason?: string;
  timeStr?: string;
  appointmentNotes?: Record<string, any> | null; 
  appointmentMedia?: Record<string, any> | null; 
  workspaceId?: string;
  checkIn?: string | null;
  checkOut?: string | null;
  contactId?: string;
  meetingLink?: string;
  // appointmentNotes?: string;
}

interface AppointmentLink {
  id?: bigint;
  created_at?: string;
  appointmentName: string;
  workspaceId?: string;
  category: any;
  duration: number|null;
  loctionType: string;
  locationDetails: string;
  timeZone: string;
  timeDetails: string   ;
  curency: string;
  amount: number;
  paymentGateway: string;
  maxBooking: number;
  sessionBreak: number;
  statusOn: boolean;
  note: string;
  appointmentAlias: string;
  createdBy: any;
  businessName: string | null;
  logo: string | null;
  brandColour: string | null;
  teamMembers: string | null;
  zikoroBranding: string | null;
  isPaidAppointment?: boolean;
  smsNotification?:string;
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
// supabase functions deploy function-name --project-ref ddlepujpbqjoogkmiwfu
//  export SUPABASE_ACCESS_TOKEN="sbp_02b68a015bee083fd8c48422d26384407fea3084"   






















// old concept

// // @ts-ignore
// Deno.serve(async (req) => {
//     try {
//         if (req.method !== "POST") {
//             return new Response("Method Not Allowed", { status: 405 });
//         }
 
//         const now = new Date();
//         const tomorrow = new Date(now);
//         tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
//         tomorrow.setHours(0, 0, 0, 0); // Start of the next day

//         const dayAfterTomorrow = new Date(tomorrow);
//         dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1); // Move to the day after
//         dayAfterTomorrow.setHours(0, 0, 0, 0); // Start of the day after tomorrow

//         // Function to format date to YYYY-MM-DD (valid SQL DATE format)
//         function formatDateToYYYYMMDD(date: Date): string {
//           return date.toISOString().slice(0, 10); // Extracts only YYYY-MM-DD
//         }

//         const formattedTomorrow = formatDateToYYYYMMDD(tomorrow);
//         const formattedDayAfterTomorrow = formatDateToYYYYMMDD(dayAfterTomorrow);

//         // Fetch pending reminders for the next calendar day
//         const { data, error } = await supabase
//           .from("bookings")
//           .select(`
//             id, phone, appointmentDate, appointmentTime, appointmentName, 
//             participantEmail, firstName, lastName, 
//             appointmentLinkId!inner(id, smsNotification, locationDetails)
//           `)
//           .eq("appointmentLinkId.smsNotification", "PENDING")
//           .gte("appointmentDate", formattedTomorrow) // Start of tomorrow (00:00)
//           .lt("appointmentDate", formattedDayAfterTomorrow); // Before the day after (00:00)


//         if (error) {
//             console.error("Error fetching reminders:", error);
//             return new Response(JSON.stringify({ error }), { status: 500 });
//         }

//         if (!data || data.length === 0) {
//             return new Response("No reminders to send", { status: 200 });
//         }

//         // Send SMS
//         let smsResponse = []
//         const groupedSmsData = groupBookingsForSms(data) 
          
//         for (const [appointmentLinkId, { formattedMsg, recipients }] of groupedSmsData) {
//           const res = await sendSms(recipients.join(", "), formattedMsg);
//           smsResponse.push(res)
//         }

//         // Update status in appointmentLink
//         // @ts-ignore
//         const appointmentIds = [...new Set(data.map(d => d.appointmentLinkId?.id).filter(id => id))];

//         let updateStatus = "No updates made";
        
//         if (appointmentIds.length > 0) {
//             const { error: updateError } = await supabase
//                 .from("appointmentLinks")
//                 .update({ smsNotification: "SENT" })
//                 .in("id", appointmentIds);

//             updateStatus = updateError ? updateError.message : "Status updated to SENT";
//         }

//         return new Response(JSON.stringify({ success: "SMS Reminders processed", smsResponse,  groupedSmsData,   }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });

//     } catch (error) {
//         console.error("Function error:", error);
//         // @ts-ignore
//         return new Response(JSON.stringify({ error: "Internal Server Error", error }), { status: 500 });
//     }
// });

// function normalizePhoneNumber(phone: string): string {
//   // Remove non-digit characters
//   let cleaned = phone.replace(/\D/g, "");

//   // Convert local format (0803...) to international format (234803...)
//   if (cleaned.startsWith("0") && cleaned.length === 11) {
//       cleaned = "234" + cleaned.slice(1);
//   } else if (cleaned.startsWith("234") && cleaned.length === 13) {
//       cleaned = "234" + cleaned.slice(3);
//   }

//   return cleaned;
// }

// function formatAppointmentDate(appointmentDate: string, appointmentTime: string) {
//   const date = new Date(appointmentDate);
//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   return `${monthNames[date.getMonth()]} ${date.getDate()} at ${appointmentTime}`;
// }

// function truncateText(text: string, maxLength: number): string {
//   return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
// }

// function groupBookingsForSms(bookings: any[]) {
//   const groupedData = new Map<
//       string,
//       { formattedMsg: string; recipients: string[] }
//   >();

//   bookings.forEach((booking) => {
//       const {
//           appointmentLinkId,
//           phone,
//           appointmentDate,
//           appointmentTime,
//           appointmentName,
//           appointmentLinkId: { locationDetails },
//       } = booking;

//       if (!appointmentLinkId?.id || !phone) return;

//       // Normalize phone number
//       const normalizedPhone = normalizePhoneNumber(phone);

//       // Format date to avoid blocked messages
//       const formattedDate = formatAppointmentDate(appointmentDate, appointmentTime);

//       // Truncate location details
//       const shortLocation = truncateText(locationDetails, 30);

//       if (!groupedData.has(appointmentLinkId.id)) {
//           const formattedMsg = `Hello, you have an appointment: "${appointmentName}" on ${formattedDate}. Location: ${shortLocation}. Please be on time.`;
//           groupedData.set(appointmentLinkId.id, { formattedMsg, recipients: [] });
//       }

//       const group = groupedData.get(appointmentLinkId.id)!;

//       // Ensure phone numbers are unique
//       if (!group.recipients.includes(normalizedPhone)) {
//           group.recipients.push(normalizedPhone);
//       }
//   });

//   return groupedData;
// }

// async function sendSms(recipients: string, message: string) {
//   try {
//     const url = `https://my.kudisms.net/api/sms?token=${KUDISMS_API_KEY}&senderID=${KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;
//     const data = new FormData();
//     data.append("token", KUDISMS_API_KEY as string);
//     data.append("senderID", KUDISMS_SENDER_ID as string);
//     data.append("recipients", recipients);
//     data.append("message", message);
//     data.append("gateway", "2");

//     const response = await fetch(url, {
//       method: "POST",
//       body: data, 
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to send SMS: ${response.statusText}`);
//     }

//     const responseData = await response.json();
//     console.log({ responseData, data });

//     return responseData;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }

 