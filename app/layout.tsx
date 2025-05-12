import type { Metadata } from "next";
import "./globals.css";
// import { montserrat } from "../utils/fonts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { montserrat } from "@/utils/fonts/montserrat";
import 'react-quill/dist/quill.snow.css'; // import styles

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.bookings.zikoro.com`),
  title: "Zikoro - Seamless Appointment Scheduling & Booking Platform",
  description:
    "Zikoro is your trusted platform for effortless appointment scheduling and booking. We streamline the process for event organizers, tutors, and clients, enabling easy management and coordination of appointments and events.",

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    url: "/zikoro-og.jpeg",
    title: "Zikoro - Appointment Scheduling & Booking",
    description:
      "Simplify appointment scheduling and booking with Zikoro. Whether you're organizing events, teaching classes, or managing appointments, our platform offers smooth and reliable tools to coordinate and manage your appointments.",
    images: [
      {
        url: "/zikoro-og.jpeg",
        width: 1200,
        height: 630,
        alt: "Effortless appointment scheduling and booking with Zikoro.",
      },
    ],
  },

  // Twitter Card (Twitter)
  twitter: {
    card: "summary_large_image",
    site: "@zikoro", // Your Twitter handle
    title: "Zikoro - Seamless Appointment Scheduling & Booking Platform",
    description:
      "Discover Zikoro, the platform that makes appointment booking and scheduling simple. Organize, manage, and track your appointments with ease, from event planning to individual appointments.",
    creator: "@zikoro",
  },

  // Additional SEO fields (optional)
  keywords:
    "Appointment booking platform, events, calendar, scheduling platform, event management, appointment scheduling, Zikoro, tutor booking, seamless coordination, event planning tools, online appointment booking, Zikoro platform",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zikoro",
    url: "https://www.bookings.zikoro.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.boookings.zikoro.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} font-montserrat antialiased`}
        // className={`${montserrat.className}  antialiased`}
      >
        <AppointmentProvider>
          <ToastContainer />
          {children}
        </AppointmentProvider>
      </body>
    </html>
  );
}
