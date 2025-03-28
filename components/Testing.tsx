'use client'
import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { sendEmail, sendSms } from '@/lib/sms'


// email reminder service
function groupBookingsForEmail(bookings: any[]) {
    const groupedData = new Map<
        string,
        { formattedMail: string; recipients: string[] }
    >();

    bookings.forEach((booking) => {
        const {
            appointmentLinkId,
            participantEmail,
            firstName,
            lastName,
            appointmentDate,
            appointmentTime,
            appointmentName,
            appointmentLinkId: { locationDetails },
        } = booking;

        if (!appointmentLinkId?.id || !participantEmail) return;

        // Format date & time for readability
        const formattedDate = formatAppointmentDate(appointmentDate, appointmentTime);

        // Generate email content
        const formattedMail = generateAppointmentEmail({
            firstName,
            lastName,
            appointmentName,
            appointmentDate: formattedDate,
            appointmentTime,
            locationDetails,
        });

        if (!groupedData.has(appointmentLinkId.id)) {
            groupedData.set(appointmentLinkId.id, { formattedMail, recipients: [] });
        }

        const group = groupedData.get(appointmentLinkId.id)!;

        // Ensure unique recipients
        if (!group.recipients.includes(participantEmail)) {
            group.recipients.push(participantEmail);
        }
    });

    return groupedData;
}

function generateAppointmentEmail({
    firstName,
    lastName,
    appointmentName,
    appointmentDate,
    appointmentTime,
    locationDetails,
}: {
    firstName: string;
    lastName: string;
    appointmentName: string;
    appointmentDate: string;
    appointmentTime: string;
    locationDetails: string;
}) {
    return `
        <div style="background-color: #f4f4f4; padding: 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr><td align="center">
              <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1740654461/logo_rogdwe.webp" alt="Company Logo" width="150" style="margin-bottom: 20px;">
            </td></tr>
            <tr><td align="center">
              <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; text-align: start;">
                <p style="color: #555;">Hi ${firstName} ${lastName},</p>
                <p style="color: #555; margin-top: 20px; margin-bottom: 20px;">
                  You have an upcoming appointment: <strong>${appointmentName}</strong>.
                </p>
                <p><strong>Date:</strong> ${appointmentDate}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
                <p><strong>Location:</strong> ${locationDetails}</p>
                <p>Need help? 📲 <a href="https://wa.me/+2347041497076">Chat with us on WhatsApp</a>!</p>
                <p>Best Regards,</p>
                <p>The Zikoro Team</p>
              </div>
            </td></tr>
          </table>
        </div>`;
}

const Testing = () => {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        try {
            setLoading(true);
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

    let smsResponse = []
    if(data){
        const groupedSmsData = groupBookingsForSms(data) 
         
        for (const [appointmentLinkId, { formattedMsg, recipients }] of groupedSmsData) {
        const res = await sendSms(recipients.join(", "), formattedMsg);
        smsResponse.push(res)
    }

console.log({ data, error, groupedSmsData, smsResponse });
    }

        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    };

    async function processEmailReminders() {
        try {
            setLoading(true);
            const now = new Date();
            const time24HoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const time25HoursFromNow = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    
            // Function to format date to YYYY-MM-DD (valid SQL DATE format)
            function formatDateToYYYYMMDD(date: Date): string {
                return date.toISOString().slice(0, 10); // Extracts only YYYY-MM-DD
                }
                          
            const formattedTime24 = formatDateToYYYYMMDD(time24HoursFromNow);
            const formattedTime25 = formatDateToYYYYMMDD(time25HoursFromNow);
    
            // Fetch pending email reminders
            const { data, error } = await supabase
                .from("bookings")
                .select(`id, phone, appointmentDate, appointmentTime, appointmentName, participantEmail,firstName,lastName, appointmentLinkId!inner(id, smsNotification, locationDetails)`)
                .eq("appointmentLinkId.smsNotification", "PENDING")
                .lte("appointmentDate", formattedTime25)
                .gte("appointmentDate", formattedTime24);
    
            if (error) {
                console.error("Error fetching reminders:", error);
                return { error };
            }
    
            if (!data || data.length === 0) {
                return { message: "No reminders to send" };
            }
    
            // Group bookings
            const groupedEmailData = groupBookingsForEmail(data);
            let emailResponses = [];
    
            for (const [appointmentLinkId, { formattedMail, recipients }] of groupedEmailData) {
                const subject = "Reminder: Your Upcoming Appointment";
                const res = await sendEmail(recipients, subject, formattedMail);
                emailResponses.push(res);
            }

            console.log({groupedEmailData, emailResponses })
    
            return { success: "Email Reminders processed", groupedEmailData, emailResponses };
        } catch (error) {
            console.error("Function error:", error);
            // @ts-ignore
            return { error: "Internal Server Error", errorMsg: error.message };
        } finally {
            setLoading(false);
        }
    }
    
  return (
    <div>
        <Button onClick={processEmailReminders}>Submit {loading ? <span>{" "}<Loader2 size={20} className='animate-spin' /></span> : null}  </Button>
    </div>
  )
}

export default Testing


// sms serice
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
