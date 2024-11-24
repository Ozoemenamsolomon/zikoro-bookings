"use client";
import React from "react";
import AppointmentLoginForm from "@/components/appointments/login/AppointmentLoginForm";

const AppointmentLoginPage = () => {
  return (
    <div className="items-center justify-center bg-white flex w-full h-screen md:bg-[url('/appointments/bgImg.webp')] md:bg-cover md:bg-center md:bg-no-repeat">
      <AppointmentLoginForm />
    </div>
  );
};

export default AppointmentLoginPage;
