import { format, parse } from "date-fns";

export const formatTime = (time: string): string | null => {
  try {
    // Remove extra spaces and normalize the format
    const cleanedTime = time.replace(/\s*:\s*/g, ":").trim(); // Fix "12 : 22 PM" to "12:22 PM"

    // Parse time from "hh:mm a" (e.g., "12:22 PM") into a Date object
    const parsedTime = parse(cleanedTime, "hh:mm a", new Date());

    // Format the parsed time as "HH:mm:ss" for PostgreSQL
    return format(parsedTime, "HH:mm:ss");
  } catch (error) {
    console.error("Invalid time format:", time);
    return null;
  }
};

export const formatTimeSafely = (time: string | null | undefined) => {
    if (!time) return "N/A";
    
    try {
      // Extracting only the time portion
      const [hours, minutes, seconds] = time.split("+")[0].split(":"); 
      const formattedTime = new Date();
      
      formattedTime.setHours(parseInt(hours, 10));
      formattedTime.setMinutes(parseInt(minutes, 10));
      formattedTime.setSeconds(parseInt(seconds, 10));
  
      return format(formattedTime, "hh : mm a"); // Convert to 12-hour format
    } catch (error) {
      return "Invalid time";
    }
  };
