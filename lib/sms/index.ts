'use server'
import { getBookingSmsReminderMsg, getEmailReminderTemplate } from "./templates";
import { createClient } from "@/utils/supabase/server";
import { Booking, BookingReminder } from "@/types/appointments";

export const populateBookingReminders = async (booking:Booking, hostEmail:string, hostPhoneNumber:string, ) => {
  const supabase = createClient();
  try {
      const appointmentDateTime = new Date(`${booking.appointmentDate}T${booking.appointmentTime}`).toISOString();
      const sendAt = appointmentDateTime
console.log({sendAt})
      // const sendAt = new Date(appointmentDateTime.getTime() - 12 * 60 * 60 * 1000); // 12 hours before

      const body = {
        bookingId: booking.id,
        phone: booking.phone,
        email: booking.participantEmail,
        smsMessage: getBookingSmsReminderMsg(booking),
        emailMessage: getEmailReminderTemplate(booking, hostEmail, hostPhoneNumber),
        sendAt,
        smsStatus: "PENDING",
        emailStatus: "PENDING",
        created_at: new Date(),
        updatedAt: new Date(),
      };
    
    const { data, error } = await supabase
      .from("bookingReminders")
      // .select()
      .insert(body)
      .select()
      .single()

      console.log("Booking reminders: ", { data, error } );
    if (error) {
      return {success:false, error:"An error prevented sms reminder setup"}
    }
    return {success:true}
  } catch (err) {
    console.error("Error populating booking reminders:", err);
  }
};


const KUDISMS_API_KEY= process.env.KUDISMS_API_KEY!
const KUDISMS_SENDER_ID= process.env.KUDISMS_SENDER_ID!

export async function sendSms(recipients: string, message: string) {
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
      body: data, // ✅ Send FormData directly (no need for headers)
    });

    const responseData = await response.json();
    console.log({ responseData, data });

    return responseData;
  } catch (error: any) {
    console.error("SMS Sending Error:", error.message);
    throw new Error(error.message);
  }
}

export const testSms = async () =>{
  const supabase = createClient();
  try {
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
      // .gte("sendAt", formattedTomorrow.toISOString() ) // Start of tomorrow (00:00)
      // .lt("sendAt", formattedDayAfterTomorrow.toISOString() ); // Before the day after (00:00)
      // console.log({data,error})
    if (error) {
        console.error("Error fetching reminders:", error);
        return error 
    }

    // Send SMS
    if (data && data.length > 0) {
      let smsResponse:SmsReminderResult[] = []; 
      const groupedSmsData = groupBookingReminders(data) 

      try {
        smsResponse = await sendSmsConcurrently(groupedSmsData);
      } catch (err) {
        console.error("Global email send error:", err);
        // Fallback error for all
        smsResponse = data.map((reminder) => ({
          id: reminder.id,
          phone: reminder.phone!,
          status: "REJECTED",
          message: "Unhandled error occurred while sending emails",
        }));
      }
      console.table(smsResponse, ["bookingId", "phone", "status", "message"]);

      const result = await updateSmsStatus(smsResponse);
      return  {
        success: "Sms Reminders processed",
        smsResponse,
        // data,
        groupedSmsData,
        result
      } 
    } else {
      return "No sms to send. Reminder list is empty" 
    }   

} catch (error) {
    console.error("Function error:", error);
    // @ts-ignore
    return { error: "Internal Server Error", error } 
}
}

type SmsReminderResult = {
  id: number;
  phone: string;
  status: "FULFILLED" | "REJECTED";
  message: string;
};

export const sendSmsConcurrently = async (
  groupedReminders: { id: number; message: string; phone: string; sendAt: string }[]
): Promise<SmsReminderResult[]> => {
  const smsPromises = groupedReminders.map(({ id, phone, message }) => {
    return {
      id,
      phone,
      promise: sendSms(phone, message),
    };
  });

  const results = await Promise.allSettled(smsPromises.map((item) => item.promise));

  const structured: SmsReminderResult[] = await Promise.all(
    results.map(async (result, index) => {
      const { id, phone } = smsPromises[index];

      if (result.status === "fulfilled") {
        try {
          const data = result.value;
          
          // Handle the response format
          if (data.status === "success") {
            return {
              id,
              phone: phone,
              status: "FULFILLED",
              message: data.msg || "SMS sent successfully",
            };
          } else {
            return {
              id,
              phone: phone,
              status: "REJECTED",
              message: data.msg || "SMS failed with an unknown error",
            };
          }
        } catch (error) {
          return {
            id,
            phone: phone,
            status: "REJECTED",
            message: "SMS sent but failed to parse response",
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
  const supabase = createClient();
   // Batch update in parallel
   const updatePromises = smsResponses.map(({phone,id,status,message}) =>
    supabase
      .from("bookingReminders")
      .update({
        smsStatus: 'PENDING',
        // smsStatusMessage: message,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, updatedAt')
      .single()
  );

  const results = await Promise.allSettled(updatePromises);
  return results
};



  export async function submitSenderId(  message: string) {
    try {
      const url = "https://kudisms.vtudomain.com/api/senderID";
  
      const formData = new FormData();
      formData.append("token", KUDISMS_API_KEY as string);
      formData.append("senderID", KUDISMS_SENDER_ID);
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

export async function checkSenderId(senderID: string) {
    try {
      const url = `https://kudisms.vtudomain.com/api/check_senderID?token=${KUDISMS_API_KEY}&senderID=${KUDISMS_SENDER_ID}`;
     
      const data = new FormData();
      data.append('token', KUDISMS_API_KEY!);
      data.append('senderID', KUDISMS_SENDER_ID);

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

// =============================================


// sending email
export const testEmail = async () => {
  const supabase = createClient()
    try {
      
      const now = new Date();
      const formattedTomorrow = new Date(now);
      formattedTomorrow.setDate(now.getDate() + 1);
      formattedTomorrow.setHours(0, 0, 0, 0);
      
      const formattedDayAfterTomorrow = new Date(formattedTomorrow);
      formattedDayAfterTomorrow.setDate(formattedTomorrow.getDate() + 1);
      
      const { data, error } = await supabase
        .from("bookingReminders")
        .select(`*, bookingId!inner(id, bookingStatus)`)
        .eq("emailStatus", "PENDING")
        .neq("bookingId.bookingStatus", "CANCELLED")
        // .gte("sendAt", formattedTomorrow.toISOString())
        // .lt("sendAt", formattedDayAfterTomorrow.toISOString());

        if (error) {
        console.error("Error fetching email reminders:", error);
        return;
      }
      
      if (data && data.length > 0) {
        let emailResponses: EmailReminderResult[] = [];
        const emailBookings = data.filter(b => !!b.email);

        try {
          emailResponses = await sendEmailsConcurrently(emailBookings);
        } catch (err) {
          console.error("Global email send error:", err);
          // Fallback error for all
          emailResponses = data.map((reminder) => ({
            id: reminder.id,
            email: reminder.email!,
            status: "REJECTED",
            message: "Unhandled error occurred while sending emails",
          }));
        }
        console.table(emailResponses, ["bookingId", "email", "status", "message"]);

        const result = await updateEmailStatus(emailResponses);
        return  {
          success: "Email Reminders processed",
          emailResponses,
          data,
          result
        } 
      } else {
        return "No email to send. Reminder list is empty" 
      }
    } catch (err) {
        console.error("Function error:", err);
        return { error: "Internal Server Error", err} 
    }
  }

const zeptoApiKey = process.env.NEXT_PUBLIC_ZEPTO_TOKEN as string;
const senderEmail = process.env.NEXT_PUBLIC_EMAIL as string;
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
  const supabase = createClient();
 
  // Batch update in parallel
  const updatePromises = emailResponses.map(({email,id,status,message}) =>
    supabase
      .from("bookingReminders")
      .update({
        emailStatus: 'PENDING',
        // emailStatusMessage: message,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
  );

  const results = await Promise.allSettled(updatePromises);
  // console.log({results});
  return results;
};
 