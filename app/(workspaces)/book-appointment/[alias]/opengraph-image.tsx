import { fetchSchedule } from "@/lib/server/schedules";
import { AppointmentLink } from "@/types/appointments";
import { ImageResponse } from "next/og";

// Static metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Default OG Image (Parent OG Image URL or similar logic)
const parentOgImage = new ImageResponse(
  <div
    style={{
      fontSize: 60,
      background: "#1e293b", // Dark gray for parent fallback
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
    }}
  >
    {`https//:bookings.zikoro.com/zikoro-og.jpeg`}
  </div>,
  {
    width: 1200,
    height: 630,
  }
);

export default async function Image({ params }: { params: { alias: string } }) {
  const alias = params.alias;

  const { data, error }: { data: AppointmentLink | null; error: any } = await fetchSchedule(alias);

  if (error || !data) {
    // Return the parent OG image if an error occurs
    return parentOgImage;
  }

  return new ImageResponse(
    <div
      style={{
        fontSize: 60,
        background: "#e5e7eb", // Light gray
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div>{data.logo}</div>
      <div style={{ marginTop: 10 }}>{data.appointmentName}</div>
    </div>,
    {
      ...size,
    }
  );
}
