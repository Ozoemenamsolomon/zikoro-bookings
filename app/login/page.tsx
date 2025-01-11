
import React from "react";
import AppointmentLoginForm from "@/components/appointments/login/AppointmentLoginForm";
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

const AppointmentLoginPage = async ({
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
  console.log({userEmail, role ,workspaceName ,workspaceAlias})
  return (
    <div className="items-center justify-center bg-white flex w-full overflow-auto no-scrollbar h-screen lg:bg-[url('/appointments/bgImg.webp')] lg:bg-cover lg:bg-center lg:bg-no-repeat">
      <AppointmentLoginForm 
        userEmail={userEmail} 
        role={role}
        workspaceName={workspaceName}
        workspaceAlias={workspaceAlias}
      />
    </div>
  );
};

export default AppointmentLoginPage;
