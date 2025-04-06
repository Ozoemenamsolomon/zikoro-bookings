import { Booking } from "@/types/appointments";

export const getEmailReminderTemplate = (
    booking: Booking, 
    hostEmail: string, 
    hostPhone: string
  ) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .details { margin-bottom: 15px; }
            .footer { font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Appointment Reminder</div>
            <p>Dear ${booking.firstName || "Attendee"},</p>
            <p>This is a friendly reminder for your upcoming appointment:</p>
            <div class="details">
              <strong>Appointment:</strong> ${booking.appointmentName || "Your appointment"} <br>
              <strong>Date:</strong> ${booking.appointmentDate || "N/A"} <br>
              <strong>Time:</strong> ${booking.appointmentTime || "N/A"} <br>
              <strong>Location:</strong> ${booking.address || "Online"} <br>
              ${booking.meetingLink ? `<strong>Meeting Link:</strong> <a href="${booking.meetingLink}">${booking.meetingLink}</a>` : ""}
            </div>
  
            <p>If you want to cancel or reschedule this appointment, contact the host with this detail.</p>
            <p>Email: ${hostEmail}</p>
            <p>Phone: ${hostPhone}</p>
            <br/>
  
            <p>Best Regards,<br>Zikoro<br><br>
              <img src="https://www.zikoro.com/_next/image?url=%2Fzikoro.png&w=128&q=75" alt="Zikoro Logo">
            </p>
          </div>
        </body>
      </html>
    `;
  };

export const getBookingSmsReminderMsg = (booking:Booking) => {
    const MAX_SMS_ADDRESS_LENGHT = 30
    const {
        appointmentLinkId,
        phone,
        appointmentDate,
        appointmentTime,
        appointmentName,
        appointmentLinkId: { locationDetails },
    } = booking;

  const shortLocation = locationDetails.length > MAX_SMS_ADDRESS_LENGHT ? locationDetails.slice(0, MAX_SMS_ADDRESS_LENGHT - 3) + "..." : locationDetails;

  const date = new Date(appointmentDate!);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()} at ${appointmentTime}`;

  return `Hello, you have an appointment: "${appointmentName}" on ${formattedDate}. Location: ${shortLocation}. Please be on time.`;
}