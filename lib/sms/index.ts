<<<<<<< HEAD
const numbers = [`2348032787601,2348139667165,2349114993947`]
=======

// Step	Action
// 0    when designing appointments add mark as send sms
// 0    when attendee is booking, if appointments is sms marked then update booking item to send sms, and add  reminder_sent to update when sms is sent
 
// 2	Supabase Scheduled Trigger (Cron Job) runs every hour.
// 3	The trigger calls Supabase Edge Function (send-sms-reminders).
// 4	The Edge Function fetches upcoming events 12 hours before start time.
// 5	If reminders are due, it calls KudiSMS API to send bulk SMS.
// 6	After successful SMS, it updates reminder_sent = true in Supabase.


// CREATE TABLE bookings (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     event_date_time TIMESTAMP NOT NULL,
//     attendee_phone TEXT NOT NULL,
//     reminder_sent BOOLEAN DEFAULT false
//   );

  
// CREATE OR REPLACE FUNCTION send_sms_reminders()
// RETURNS VOID AS $$
// BEGIN
//   PERFORM net.http_post(
//     url := 'https://your-supabase-project.supabase.co/functions/v1/send-sms-reminders',
//     headers := jsonb_build_object('Content-Type', 'application/json'),
//     body := jsonb_build_object('trigger', 'cron')
//   );
// END;
// $$ LANGUAGE plpgsql;

// SELECT cron.schedule('send_sms_reminders', '0 * * * *', $$ CALL send_sms_reminders() $$);


// /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// const supabase = createClient(supabaseUrl, supabaseKey);

// const SMS_API_URL = "https://kudisms.vtudomain.com/api/sms";
// const API_TOKEN = Deno.env.get("KUDISMS_API_KEY") as string;
// const SENDER_ID = Deno.env.get("KUDISMS_SENDER_ID") as string;

// Deno.serve(async () => {
//   try {
//     // Fetch upcoming bookings that need reminders
//     const now = new Date();
//     const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);

//     const { data: bookings, error } = await supabase
//       .from("bookings")
//       .select("id, attendee_phone, event_date_time")
//       .eq("reminder_sent", false)
//       .lt("event_date_time", twelveHoursLater.toISOString());

//     if (error) throw new Error(error.message);
//     if (!bookings.length) return new Response("No reminders needed", { status: 200 });

//     // Construct bulk SMS payload
//     const recipients = bookings.map(b => b.attendee_phone).join(",");
//     const message = "Reminder: You have an appointment in 12 hours. Don't forget!";

//     const response = await fetch(SMS_API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         token: API_TOKEN,
//         senderID: SENDER_ID,
//         recipients,
//         message,
//         gateway: "2",
//       }),
//     });

//     const smsResult = await response.json();
//     console.log("SMS API Response:", smsResult);

//     if (response.ok) {
//       // Update bookings to mark reminders as sent
//       const bookingIds = bookings.map(b => b.id);
//       await supabase.from("bookings").update({ reminder_sent: true }).in("id", bookingIds);
//     }

//     return new Response("SMS reminders sent!", { status: 200 });
//   } catch (error) {
//     console.error("Error sending SMS reminders:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// });



import axios from 'axios';

export async function sendSms(recipients: string, message: string) {
    try {
 
      const url = `https://my.kudisms.net/api/sms?token=${process.env.KUDISMS_API_KEY}&senderID=${process.env.KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

      const data = new FormData();
            data.append("token", process.env.KUDISMS_API_KEY as string);
            data.append("senderID", process.env.KUDISMS_SENDER_ID as string);
            data.append("recipients", recipients);
            data.append("message", message); 
            data.append("gateway", "2");

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url,
                data : data
              };
          
              const response = await axios(config);
              console.log({response})
              return response.data;
  
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body:{ data:formData},
    //   });
  
    //   const data = await response.json();
    //   return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  

  export async function submitSenderId(senderID: string, message: string) {
    try {
      const url = "https://kudisms.vtudomain.com/api/senderID";
  
      const formData = new FormData();
      formData.append("token", process.env.KUDISMS_API_KEY as string);
      formData.append("senderID", senderID);
      formData.append("message", message);
  
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit sender ID: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
//   import { NextResponse } from "next/server";
// import { submitSenderId } from "@/lib/submitSenderId";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { senderID, message } = body;

//     if (!senderID || !message) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const response = await submitSenderId(senderID, message);
//     return NextResponse.json(response);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// async function submitSender() {
//     const res = await fetch("/api/submit-sender", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         senderID: "Newsreel",
//         message: "Testing API sender ID",
//       }),
//     });
  
//     const data = await res.json();
//     console.log(data);
//   }
  

export async function checkSenderId(senderID: string) {
    try {
      const url = `https://kudisms.vtudomain.com/api/check_senderID?token=${process.env.KUDISMS_API_KEY}&senderID=${senderID}`;
     
      const data = new FormData();
      data.append('token', process.env.KUDISMS_API_KEY!);
      data.append('senderID', senderID);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body:data
      });
  
      if (!response.ok) {
        throw new Error(`Failed to check sender ID: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

//   import { NextResponse } from "next/server";
// import { checkSenderId } from "@/lib/checkSenderId";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const senderID = searchParams.get("senderID");

//     if (!senderID) {
//       return NextResponse.json({ error: "Missing senderID parameter" }, { status: 400 });
//     }

//     const response = await checkSenderId(senderID);
//     return NextResponse.json(response);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// async function checkSender() {
//     const senderID = "neo"; // Example sender ID
//     const res = await fetch(`/api/check-sender?senderID=${senderID}`, {
//       method: "GET",
//     });
  
//     const data = await res.json();
//     console.log(data);
//   }
  
>>>>>>> 1185201ccefd11fefd6a67870335966c7a1388d3
