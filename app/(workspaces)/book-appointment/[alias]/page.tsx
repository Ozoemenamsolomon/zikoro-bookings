import Booking from "@/components/workspace/booking";
import { fetchSchedule } from "@/lib/server/schedules";
import React, { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { AppointmentLink } from "@/types/appointments";
import BookingOff from "@/components/workspace/booking/BookingOff";
import { fetchWorkspace } from "@/lib/server/workspace";
import { getPermissionsFromSubscription } from "@/lib/server/subscriptions";
import { fetchScheduleX, fetchWorkspaceX } from "@/lib/server/secreteServer";
import BookingLazyLoader from "@/components/workspace/booking/LazyLoader";

// Dynamic Metadata Generation
export async function generateMetadata(
  { params }: { params: { alias: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentInfo = await parent;
  const parentTitle = parentInfo.title?.absolute || "Zikoro booking space";
  const parentDescription = parentInfo.description || "Plan your events and appointments like a pro";

  const alias = (await params).alias;

  const { data, error }: { data: AppointmentLink | null; error: any } = await fetchScheduleX(alias);

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
const BookAppointment = async ({ params }: { params: { alias: string } }) => {
  const alias = (await params).alias;

  const { data, error } = await fetchScheduleX(alias);

  if (error) {
    // Handle error state if required (e.g., return a custom error page or message)
    return (
        <main className="min-h-screen w-full flex justify-center items-center">
            <BookingOff errortext={`The booking link does not seem to exist`} />        
        </main>
    )
  }

  const { data: organization, error: orgError } = await fetchWorkspaceX(data.workspaceId);

  if (orgError || !organization) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center">
        <BookingOff errortext="The booking link is currently not available" />
      </main>
    );
  }

  const { plan: { remaininBookings } } = await getPermissionsFromSubscription(organization);

  if (remaininBookings && remaininBookings < 1) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center">
        <BookingOff errortext="The booking link is currently not available" />
      </main>
    );
  }

  return <Booking appointmentLink={data} error={error} />
};

const BookAppointmentPage = ({ params }: { params: { alias: string } }) => {
  return (
    // <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center txt-4xl font-bold">...</div>} >
    <Suspense fallback={<BookingLazyLoader/>} > 
      <BookAppointment params={params}/>
    </Suspense>

  )
}

export default BookAppointmentPage;
