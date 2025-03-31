import AppointmentFooter from "@/components/appointments/home/AppointmentFooter";
import AppointmentNav from "@/components/appointments/home/AppointmentNav";
import AppointmentSec1 from "@/components/appointments/home/AppointmentSec1";
import AppointmentSec2 from "@/components/appointments/home/AppointmentSec2";
import AppointmentSec3 from "@/components/appointments/home/AppointmentSec3";
import AppointmentSec4 from "@/components/appointments/home/AppointmentSec4";
import AppointmentSec5 from "@/components/appointments/home/AppointmentSec5";
import { checkUserExists } from "@/lib/server/workspace";
import { createClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Head from "next/head";


const jwtSecret = process.env.AUTH0_SECRET!;

interface TokenPayload {
  email: string;
  workspaceName: string;
  role: string;
  workspaceAlias: string;
  exp: number;
}

const AppointmentHomePage = async ({
  searchParams: { token },
}: {
  searchParams: { token?: string };
}) => {
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Events",
        item: "https://www.zikoro.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bookings",
        item: "https://bookings.zikoro.com/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Engagements",
        item: "https://engagements.zikoro.com/",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Credentials",
        item: "https://credentials.zikoro.com/",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Pricing",
        item: "https://www.zikoro.com/pricing",
      },
    ],
  };
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      </Head>
      <div className="bg-[#f9faff]">
        <div className="sticky top-4 z-10">
          <AppointmentNav />
        </div>
        <AppointmentSec1 />
        <AppointmentSec2 />
        <AppointmentSec3 />
        <AppointmentSec4 />
        <AppointmentSec5 />
        <AppointmentFooter />
      </div>
    </>
  );
};

export default AppointmentHomePage;
