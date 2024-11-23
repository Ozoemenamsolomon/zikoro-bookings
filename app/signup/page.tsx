import SignupForm from "@/components/appointments/signup/SignupForm";
import Image from "next/image";
import React from "react";

const AppointmentSignupPage = () => {
  return (
    <div className="bg-[#f9faff] min-h-screen">
      {/* banner */}
      <Image
        src="/appointments/signupBanner.png"
        alt="banner"
        width={1140}
        height={377}
        className="w-full h-full object-cover hidden lg:block "
      />

      <Image
        src="/appointments/signupBannerS.png"
        alt="banner"
        width={375}
        height={215}
        className="w-full h-full object-cover block lg:hidden"
      />

      {/* dynamic components */}
        <SignupForm />
    </div>
  );
};

export default AppointmentSignupPage;
