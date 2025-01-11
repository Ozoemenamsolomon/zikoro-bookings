import Booking from "@/components/workspace/booking";
import { fetchSchedule } from "@/lib/server/schedules";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { AppointmentLink } from "@/types/appointments";
import BookingOff from "@/components/workspace/booking/BookingOff";

// Dynamic Metadata Generation
export async function generateMetadata(
  { params }: { params: { alias: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentInfo = await parent;
  const parentTitle = parentInfo.title?.absolute || "Default Parent Title";
  const parentDescription = parentInfo.description || "Default Parent Description";

  const alias = (await params).alias;

  const { data, error }: { data: AppointmentLink | null; error: any } = await fetchSchedule(alias);

  if (error || !data) {
    // Fallback to parent metadata if fetching fails
    return {
      title: parentTitle,
      description: parentDescription,
    };
  }

  return {
    title: `Zikoro Bookings | ${data.appointmentName || parentTitle}`,
    description: data.note || data.businessName || data.appointmentName || parentDescription,
  };
}

// Booking Page Component
const BookAppointmentPage = async ({ params }: { params: { alias: string } }) => {
  const alias = (await params).alias;

  const { data, error } = await fetchSchedule(alias);
  if (error || !data) {
    // Handle error state if required (e.g., return a custom error page or message)
    return (
        <main className="min-h-screen w-full flex justify-center items-center">
            <BookingOff errortext={`The booking link does not seem to exist`} />        
        </main>
    )
  }

  return <Booking appointmentLink={data} error={error} />
};

export default BookAppointmentPage;
