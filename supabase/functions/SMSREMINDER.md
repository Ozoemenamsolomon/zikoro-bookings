# SMS Reminder Edge Function

This Supabase Edge Function is responsible for sending SMS reminders for upcoming appointments. It fetches pending reminders, groups them by appointment, ensures unique phone numbers, formats messages appropriately, and sends SMS notifications.

## Features
- Fetches pending SMS reminders from the `bookings` table.
- Groups bookings by appointment to avoid duplicate messages.
- Normalizes phone numbers to a standard format (`234XXXXXXXXXX`).
- Formats appointment dates and times to bypass blocked keywords (e.g., years like `2025`).
- Ensures location details do not exceed 30 characters.
- Sends SMS using the KudiSMS API.
- Updates the `smsNotification` status to `"SENT"` in the `appointmentLinks` table.

## Environment Variables
- `SUPABASE_URL`: The Supabase project URL.
- `SUPABASE_KEY`: The Supabase service role key.
- `KUDISMS_API_KEY`: API key for KudiSMS.
- `KUDISMS_SENDER_ID`: Sender ID for SMS messages.

## Function Flow

1. **Fetch Appointments**  
   - Queries the `bookings` table for reminders within the next 24–25 hours.
   - Joins with `appointmentLinks` to check the `smsNotification` status.
   - Retrieves relevant details such as phone numbers, appointment names, and locations.

2. **Process and Group Messages**  
   - Groups messages by `appointmentLinkId`.
   - Formats dates as `MMM DD at HH:mm:ss` (e.g., `Mar 29 at 08:05:00`).
   - Truncates location details to 30 characters.
   - Normalizes phone numbers and ensures uniqueness within an appointment.

3. **Send SMS Messages**  
   - Sends SMS reminders using the KudiSMS API.
   - If a message contains a blocked keyword (e.g., `2025`), it reformats the date.

4. **Update SMS Status**  
   - Updates `appointmentLinks.smsNotification` to `"SENT"`.

## Key Functions

### `normalizePhoneNumber(phone: string): string`
- Converts phone numbers into the `234XXXXXXXXXX` format.
- Removes special characters and handles local/international formats.

### `formatAppointmentDate(appointmentDate: string, appointmentTime: string): string`
- Formats the appointment date as `MMM DD at HH:mm:ss` (e.g., `Mar 29 at 08:05:00`).

### `truncateText(text: string, maxLength: number): string`
- Truncates text and appends `"..."` if it exceeds `maxLength`.

### `groupBookingsForSms(bookings: any[])`
- Groups bookings by `appointmentLinkId`.
- Ensures unique phone numbers within each group.

### `sendSms(recipients: string, message: string)`
- Sends SMS messages using the KudiSMS API.

## API Request Format

### Request (Supabase Edge Function Trigger)
```http
POST /functions/v1/sms-reminder
Content-Type: application/json
```

### Response (Success)
```json
{
  "success": "SMS Reminders processed",
  "groupedSmsData": { ... }
}
```

### Response (Error)
```json
{
  "error": "Internal Server Error",
  "errorMsg": "Error details here"
}
```

## Notes
- This function runs on a scheduled trigger or manually via API.
- Handles API failures by logging errors.
- Ensures compliance with SMS provider restrictions (e.g., blocked keywords).

