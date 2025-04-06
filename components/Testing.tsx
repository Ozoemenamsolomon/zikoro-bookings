'use client'
import { createClient } from '@/utils/supabase/client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { populateBookingReminders,   sendSms, testEmail, testSms } from '@/lib/bookingReminders'
import { Booking } from '@/types/appointments'

 
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
        // const res = await populateBookingReminders(bookingSample, bookingSample.appointmentLinkId.createdBy.userEmail, bookingSample.appointmentLinkId.createdBy.phoneNumber)

        const res = await testSms()
        // const res = await sendSms('2349114993947','Testing sms api')
        // const res = await testEmail()
        console.log({res })
        //  await sendBulkEmails(['ecudeji@gmail.com', 'printolabi@gmail.com'], 'Testing bulk emails', 'Hi emma, i am just testing', 'icsContent')
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

const bookingSample:Booking = {
    "id": 389,
    "created_at": "2025-04-02T09:39:12.847448+00:00",
    "appointmentLinkId": {
        "id": 130,
        "created_at": "2025-03-28T12:25:51.322233+00:00",
        "appointmentName": "BISMARK EDGE Test 2",
        "category": "\"\"",
        "duration": 45,
        "loctionType": "Onsite",
        "locationDetails": "21 Odogwu Str Owerri",
        "timeZone": "(UTC+01:00) West Central Africa",
        "timeDetails": "[{\"day\":\"Monday\",\"from\":\"01:00 AM\",\"to\":\"11:00 PM\",\"enabled\":true},{\"day\":\"Tuesday\",\"from\":\"12:00 AM\",\"to\":\"11:30 PM\",\"enabled\":true},{\"day\":\"Wednesday\",\"from\":\"12:00 AM\",\"to\":\"11:30 PM\",\"enabled\":true},{\"day\":\"Thursday\",\"from\":\"12:00 AM\",\"to\":\"11:30 PM\",\"enabled\":true},{\"day\":\"Friday\",\"from\":\"08:00 AM\",\"to\":\"05:00 PM\",\"enabled\":true},{\"day\":\"Saturday\",\"from\":\"12:00 AM\",\"to\":\"11:30 PM\",\"enabled\":true},{\"day\":\"Sunday\",\"from\":\"12:00 AM\",\"to\":\"11:30 PM\",\"enabled\":true}]",
        "curency": "",
        "amount": null,
        "paymentGateway": "",
        "maxBooking": 1,
        "sessionBreak": 10,
        "statusOn": true,
        "note": "Best classes for hacking students",
        "appointmentAlias": "3ee95b43-6b7b-4ad7-9ae3-8b1098f6fc1e",
        "createdBy": {
            "id": 127,
            "userEmail": "ecudeji@gmail.com",
            "organization": null,
            "firstName": "Emmanuel",
            "lastName": "Udeji",
            "phoneNumber": "08032787601"
        },
        "businessName": "Fourth workspace",
        "logo": "",
        "brandColour": "#696969",
        "teamMembers": "printolabi@gmail.com",
        "zikoroBranding": false,
        "customerPay": null,
        "addAddress": null,
        "workspaceId": "fourth-workspace-uCuzD",
        "smsNotification": "PENDING"
    },
    "participantEmail": "printolabi@gmail.com",
    "appointmentDate": "2025-04-06",
    "appointmentTime": "10:10:00",
    "scheduleColour": "#696969",
    "teamMembers": "printolabi@gmail.com",
    "appointmentType": "",
    "appointmentName": "BISMARK EDGE TEST 4",
    "bookingStatus": "",
    "firstName": "Udoka",
    "lastName": "Bekee",
    // "phone": "08032787601",
    "phone": "09114993947",
    "price": null,
    "currency": null,
    "feeType": "Free",
    "createdBy": 127,
    "appointmentTimeStr": "12:50 PM - 1:35 PM",
    "appointmentDuration": 45,
    "notes": "My main line testing sms",
    "appointmentNotes": {},
    "appointmentMedia": null,
    "meetingLink": '',
    "contactId": '',
    "address": '',
    "checkIn": null,
    "checkOut": null,
    "workspaceId": "fourth-workspace-uCuzD"
}