// import { AppointmentProvider } from "@/components/appointments/context/AppointmentContext";
import type { Metadata } from "next";
// import Main from '@/components/appointments/Main'

export const metadata: Metadata = {
  title: `Schedule and manage appointments`,
};


export default function Layout({ children }: { children: React.ReactNode }) {

  return (

    <main className='mx-auto max-w-80'>
        {children}
    </main>

  );
}
