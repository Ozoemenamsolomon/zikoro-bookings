import React from "react";
import AppointmentLoginForm from "@/components/appointments/login/AppointmentLoginForm";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { checkUserExists } from "@/lib/server/workspace";
import { User } from "@/types/appointments";

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
  let userExists: User | null = null;
  let redirectString = ""

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

      if (!decoded?.email || !decoded?.workspaceName || !decoded?.workspaceAlias) {
        console.error("Invalid token payload");
        redirectString = "/signup?message=Token validation failed";
      }
      // if token and user does not exist, then signup
      userExists = await checkUserExists(decoded.email);
      if (!userExists) {
        redirectString = `/signup?token=${token}`;
      }
      // esle: Signin with workspaceAlias 
      userEmail = decoded.email;
      workspaceName = decoded.workspaceName;
      workspaceAlias = decoded.workspaceAlias;
      role = decoded.role;
    } catch (error) {
      console.error("Unhandled error:", error);
      redirectString = "/signup?message=Invalid or expired token";
    }
  } 

  if (redirectString) {
    redirect(redirectString)
  }

  return (
    <div className="items-center justify-center bg-white flex w-full overflow-auto no-scrollbar h-screen lg:bg-[url('/appointments/bgImg.webp')] lg:bg-cover lg:bg-center lg:bg-no-repeat">
      <AppointmentLoginForm
        userEmail={userEmail}
        role={role}
        workspaceName={workspaceName}
        workspaceAlias={workspaceAlias}
        userData={userExists}
      />
    </div>
  );
};

export default AppointmentLoginPage;
