import AppointmentFooter from "@/components/appointments/home/AppointmentFooter";
import AppointmentNav from "@/components/appointments/home/AppointmentNav";
import AppointmentSec1 from "@/components/appointments/home/AppointmentSec1";
import AppointmentSec2 from "@/components/appointments/home/AppointmentSec2";
import AppointmentSec3 from "@/components/appointments/home/AppointmentSec3";
import AppointmentSec4 from "@/components/appointments/home/AppointmentSec4";
import AppointmentSec5 from "@/components/appointments/home/AppointmentSec5";
import { createClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

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
  if (token) {
    let redirectUrl = "/error?message=Token validation failed";

    try {
      // Decode and validate the token
      const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

      if (!decoded?.email) {
        console.error("Invalid token payload");
        redirectUrl = "/error?message=Invalid token";
      } else {
        const userExists = await checkUserExists(decoded.email);
        redirectUrl = userExists ? `/login?token=${token}` : `/signup?token=${token}`;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
    }

    // Perform redirect outside the async flow
    redirect(redirectUrl);
  }

  return (
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
  );
};

// Mock database check function (replace with real implementation)
async function checkUserExists(email: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('userEmail')
    .eq('userEmail', email)
    .limit(1);

  if (error) {
    console.error('Error checking user existence:', error);
  }

  return data !== null && data.length > 0;
}

export default AppointmentHomePage;
