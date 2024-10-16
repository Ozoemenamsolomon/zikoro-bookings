import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "../utils/fonts";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.bookings.zikoro.com`),
  title: "Zikoro - Seamless Appointment Scheduling & Booking Platform",
  description: "Zikoro is your trusted platform for effortless appointment scheduling and booking. We streamline the process for event organizers, tutors, and clients, enabling easy management and coordination of appointments and events.",

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    url: "/zikoro-og.jpeg",
    title: "Zikoro - Effortless Appointment Scheduling & Booking",
    description: "Simplify appointment scheduling and booking with Zikoro. Whether you're organizing events, teaching classes, or managing appointments, our platform offers smooth and reliable tools to coordinate and manage your appointments.",
    images: [
      {
        url: "/zikoro-og.jpeg",
        width: 1200,
        height: 630,
        alt: 'Effortless appointment scheduling and booking with Zikoro.'
      }
    ]
  },

  // Twitter Card (Twitter)
  twitter: {
    card: "summary_large_image",
    site: "@zikoro", // Your Twitter handle
    title: "Zikoro - Seamless Appointment Scheduling & Booking Platform",
    description: "Discover Zikoro, the platform that makes appointment booking and scheduling simple. Organize, manage, and track your appointments with ease, from event planning to individual appointments.",
    creator: "@zikoro",
  },

  // Additional SEO fields (optional)
  keywords: "Appointment booking platform, events, calendar, scheduling platform, event management, appointment scheduling, Zikoro, tutor booking, seamless coordination, event planning tools, online appointment booking, Zikoro platform",
  robots: "index, follow",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ToastContainer />
      <body
        className={`${montserrat.className}  antialiased`}
        >
        {children}
      </body>
    </html>
  )
}
