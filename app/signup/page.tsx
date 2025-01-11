import React from "react";
import AppointmentSignupForm from "@/components/appointments/signup/AppointmentSignupForm";
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

const AppointmentSignupPage = async ({
  searchParams: { token },
}: {
  searchParams: { token?: string };
}) => {
  let userEmail = "";
  let workspaceName = "";
  let workspaceAlias = "";
  let role = "";

  if (token) {
    let redirectUrl = "/error?message=Token validation failed";

    try {
      // Decode and validate the token
      const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

      if (!decoded?.email || !decoded?.workspaceName || !decoded?.workspaceAlias) {
        console.error("Invalid token payload");
        redirectUrl = "/error?message=Invalid token payload";
      } else {
        userEmail = decoded.email;
        workspaceName = decoded.workspaceName;
        workspaceAlias = decoded.workspaceAlias;
        role = decoded.role;
        redirectUrl = ""; // No redirection required if data is valid
      }
    } catch (error) {
      console.error("Token validation failed:", error);
    }

    // Redirect if any validation error occurs
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  return (
    <div className="flex items-center lg:items-start bg-white w-full h-screen gap-x-[162px] justify-center lg:bg-[url('/appointments/bgImg.webp')] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:h-fit xl:h-screen py-1 px-5 lg:py-[50px] lg:px-[50px] xl:px-[91px] xl:py-[50px] max-w-full">
      {/* Left Section */}
      <div className="mt-[34px] hidden lg:block">
        <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-[32px] font-extrabold leading-none">
          Get started with{" "}
          <span className="leading-none text-[40px] inline lg:block">Zikoro Bookings</span>
        </p>
        <p className="text-base p-2 text-white bg-blue-500 font-medium opacity-50 mt-[10px] rounded-[8px]">
          Simplify Scheduling for a Seamless Client Experience.
        </p>
      </div>

      {/* Right Section */}

      <div>
        <AppointmentSignupForm
          userEmail={userEmail} 
          role={role}
          workspaceName={workspaceName}
          workspaceAlias={workspaceAlias}
        />
      </div>
    </div>
  );
};

export default AppointmentSignupPage;
