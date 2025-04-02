'use server'

import axios from "axios";

      // const KUDISMS_API_KEY='tjwRx5iS6JMGnU749FBDAh3Nbd1KceYWsZLTIkXCfzVrmPHlpOQoqEyv0au8g2'
      // const KUDISMS_SENDER_ID='Zikoro'
      
// export async function sendSms(recipients: string, message: string) {
//   try {
//     const url = `https://my.kudisms.net/api/sms?token=${process.env.KUDISMS_API_KEY}&senderID=${process.env.KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

//     const data = new FormData();
//     data.append("token", process.env.KUDISMS_API_KEY as string);
//     data.append("senderID", process.env.KUDISMS_SENDER_ID as string);
//     data.append("recipients", recipients);
//     data.append("message", message);
//     data.append("gateway", "2");

//     const response = await fetch(url, {
//       method: "POST",
//       body: data, // ✅ Send FormData directly (no need for headers)
//     });

//     const responseData = await response.json();
//     console.log({ responseData, data });

//     return responseData;
//   } catch (error: any) {
//     console.error("SMS Sending Error:", error.message);
//     throw new Error(error.message);
//   }
// }


// export async function sendSms(recipients: string, message: string) {
//   try {
//       const url = `https://my.kudisms.net/api/sms?token=${process.env.KUDISMS_API_KEY}&senderID=${process.env.KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

//     // const data = new URLSearchParams();
//     // data.append("token", KUDISMS_API_KEY as string);
//     // data.append("senderID", KUDISMS_SENDER_ID as string);
//     // data.append("recipients", recipients);
//     // data.append("message", message);
//     // data.append("gateway", "2");
//     const data = {
//       "token": process.env.KUDISMS_API_KEY as string,
//       "senderID": process.env.KUDISMS_SENDER_ID as string,
//       "recipients": recipients,
//       "message": message,
//       "gateway": "2"
//     }
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: data.toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to send SMS: ${response.statusText}`);
//     }

//     const dataa = await response.json();
//     console.log({ dataa, data, url });

//     return {dataa,data:data.toString()};
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }

export async function sendSms(recipients: string, message: string) {
    try {



      const url = `https://my.kudisms.net/api/sms?token=${KUDISMS_API_KEY}&senderID=${KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

      const data = new FormData();
            data.append("token", KUDISMS_API_KEY as string);
            data.append("senderID", KUDISMS_SENDER_ID as string);
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
          return response.data
  
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


import { getBookingSmsReminderMsg, getEmailReminderTemplate } from "./templates";
 
import { createClient } from "@/utils/supabase/server";
import { Booking } from "@/types/appointments";

 const supabase = createClient();

export const populateBookingReminders = async (booking:Booking, hostEmail:string, hostPhoneNumber:string, ) => {
  try {
      const appointmentDateTime = new Date(`${booking.appointmentDate}T${booking.appointmentTime}`);
      // const sendAt = new Date(appointmentDateTime.getTime() - 12 * 60 * 60 * 1000); // 12 hours before
      const sendAt = appointmentDateTime

      const body = {
        bookingId: booking.id,
        phone: booking.phone,
        email: booking.email,
        smsMessage: getBookingSmsReminderMsg(booking),
        emailMessage: getEmailReminderTemplate(booking, hostEmail, hostPhoneNumber),
        sendAt,
        smsStatus: "PENDING",
        emailStatus: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    
    const { data, error } = await supabase
      .from("bookingReminders")
      .upsert(body);

      console.log("Booking reminders: ", { data, error } );
    if (error) {
      return {success:false, error:"An error prevented sms reminder setup"}
    }
    return {success:true}
  } catch (err) {
    console.error("Error populating booking reminders:", err);
  }
};

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

  // results.forEach(({ data, error }, index) => {
  //   if (error) {
  //     console.error(`Error updating record ${index}:`, error);
  //   } else {
  //     console.log(`Updated record ${index}:`, data);
  //   }
  // });
};


// sending email
import { SendMailClient } from 'zeptomail';

const client = new SendMailClient({
  url: process.env.NEXT_PUBLIC_ZEPTO_URL,
  token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
});

const senderAddress = process.env.NEXT_PUBLIC_EMAIL;
const senderName = "Zikoro";


export const sendBulkEmails = async (recipients: string[], subject: string, htmlBody: string, icsContent: string) => {
  console.log({
    senderAddress,url: process.env.NEXT_PUBLIC_ZEPTO_URL,token: process.env.NEXT_PUBLIC_ZEPTO_TOKEN,
  })
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
    console.log({response})
    return response;
  } catch (error) {
    console.error("Error sending bulk email:", error);
    throw error;
  }
};

// example 2
export const sendEmailsConcurrently = async (recipients: string[], subject: string, htmlBody: string, icsContent: string) => {
  const emailPromises = recipients.map(email => 
    client.sendMail({
      from: { address: senderAddress, name: senderName },
      to: [{ email_address: { address: email.trim(), name: "Attendee" } }],
      subject,
      htmlbody: htmlBody,
      attachments: [
        {
          name: 'appointment.ics',
          content: Buffer.from(icsContent).toString('base64'),
          mime_type: 'text/calendar',
        },
      ],
    })
  );

  return Promise.allSettled(emailPromises);
};
