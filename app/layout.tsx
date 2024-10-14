import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "../utils/fonts";

export const metadata: Metadata = {
  title: "Zikoro Bookings",
  description: "Schedule and book appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
