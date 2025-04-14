 # SMS Reminder Edge Function

This Supabase Edge Function is responsible for sending SMS reminders for upcoming appointments. It fetches pending reminders, groups them by appointment, ensures unique phone numbers, formats messages appropriately, and sends SMS notifications.

---

### **Updated SMS Reminder System**
#### **Flow Overview**
1. **Host creates an appointment.**
2. **Attendees book an appointment.**
3. **A new entry is added to the `sms_reminders` table** with `PENDING` status.
4. **A scheduled cron job (every hour) triggers the Edge Function.**
5. **Edge Function processes reminders**:
   - Fetches **unsent reminders** for the next day (00:00 onwards).
   - Groups by appointment, ensuring unique phone numbers.
   - Sends SMS via KudiSMS.
   - Updates reminder status (`SENT` or `FAILED`).
6. **Ensures resilience** by retrying failed messages in the next run.

---

### **Database Schema Update**
#### **New `bookingReminders` Table**
| Column           | Type         | Description |
|-----------------|-------------|-------------|
| `id`           | UUID (PK)   | Unique identifier for each reminder |
| `bookingId` | UUID (FK) | Links to the `appointments` table |
| `phone`  | VARCHAR     | Attendee's phone number |
| `email`  | VARCHAR     | Attendee's email |
| `message`      | TEXT        | SMS message content |
| `sendAt`      | TIMESTAMP   | Scheduled send time (12 hours before appointment) |
| `status`       | ENUM        | `PENDING`, `SENT`, `FAILED` |
| `createdAt`   | TIMESTAMP   | Record creation timestamp |
| `updatedAt`   | TIMESTAMP   | Last update timestamp |

---

### **Edge Function: `send-sms-reminders`**
#### **1. Fetch Pending Reminders**
- Retrieves all reminders where:
  - `status = 'PENDING'`
  - `send_at` is **within the next 24 hours** from execution time.

```sql
SELECT * FROM sms_reminders
WHERE status = 'PENDING'
AND send_at BETWEEN NOW() AND NOW() + INTERVAL '24 HOURS';
```

#### **2. Process & Group Messages**
- **Avoids duplicate messages** for the same appointment.
- **Formats phone numbers** to standard `234XXXXXXXXXX`.
- **Ensures message compliance** (e.g., no blocked keywords).
- **Truncates long location names**.

#### **3. Send SMS**
- Calls the **KudiSMS API** with batched requests.
- If an API failure occurs, logs the error and **marks the status as `FAILED`**.

#### **4. Update SMS Status**
- If successful, **marks `status = 'SENT'`**.
- If failed, **logs error and retries on the next cron run**.

```sql
UPDATE sms_reminders
SET status = 'SENT', updated_at = NOW()
WHERE id = $1;
```

---

### **Cron Job Execution**
- Runs **every hour** to trigger `send-sms-reminders`.
- Ensures reminders for the next day (from 00:00 onwards) **aren't skipped** even if the cron runs late (e.g., at 11 PM today).

---

### **Benefits of this Approach**
✅ **Better SMS Tracking** – Each reminder has a separate status (`PENDING`, `SENT`, `FAILED`).  
✅ **Prevents Duplicate Messages** – Groups bookings per appointment.  
✅ **More Reliable Execution** – Ensures all reminders are sent, even if the cron job runs late.  
✅ **Easier Debugging** – Failed reminders are retried in the next execution.  

Let me know if you want to tweak any part! 🚀




---

# Option 2

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



