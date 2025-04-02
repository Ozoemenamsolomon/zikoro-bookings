'use client'
import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { sendBulkEmails, sendSms } from '@/lib/sms'

 
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
 
    const testEmailing = async () => {
         await sendBulkEmails(['ecudeji@gmail.com', 'printolabi@gmail.com'], 'Testing bulk emails', 'Hi emma, i am just testing', 'icsContent')
    }
  return (
    <div>
        <Button onClick={testEmailing}>Submit {loading ? <span>{" "}<Loader2 size={20} className='animate-spin' /></span> : null}  </Button>
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
