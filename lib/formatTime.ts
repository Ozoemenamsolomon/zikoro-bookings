import { format, parse } from "date-fns";

export const formatTime = (time: string, date: string | Date): string | null => {
  try {
    // Normalize time format (e.g., "12 : 22 PM" → "12:22 PM")
    const cleanedTime = time.replace(/\s*:\s*/g, ":").trim();

    // Parse time from "hh:mm a" (e.g., "12:22 PM") and merge with the given date
    const parsedDate = parse(cleanedTime, "hh:mm a", new Date(date));

    // Ensure valid date before formatting
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid parsed date");
    }

    // Return ISO string (e.g., "2025-02-20T12:22:00.000Z")
    return parsedDate.toISOString();
  } catch (error) {
    console.error("Invalid time or date format:", time, date, error);
    return null;
  }
};
