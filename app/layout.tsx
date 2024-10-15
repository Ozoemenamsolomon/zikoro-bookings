import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "../utils/fonts";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer />
      <body
        className={`${montserrat.className}  antialiased`}
        >
        {children}
      </body>
    </html>
  )
}
