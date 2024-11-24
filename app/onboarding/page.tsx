// import Onboarding from "@/components/auth/Onboarding";
// type SearchParamsType = {
//   email: string,
//   createdAt: string
// }
// export default function Page({searchParams}:{searchParams:SearchParamsType}) {
//   return <Onboarding searchParams={searchParams}/>
// }


import Onboarding from "@/components/appointments/onboarding/Onboarding";
import Image from "next/image";
import React from "react";

const AppointmentSignupPage = () => {
  return (
    <div className="bg-[#f9faff] min-h-screen">
      {/* banner */}
      <Image
        src="/appointments/signupBanner.webp"
        alt="banner"
        width={1140}
        height={377}
        className="w-full h-full object-cover hidden lg:block "
      />

      <Image
        src="/appointments/signupBannerS.webp"
        alt="banner"
        width={375}
        height={215}
        className="w-full h-full object-cover block lg:hidden"
      />

      {/* dynamic components */}
        <Onboarding />
    </div>
  );
};

export default AppointmentSignupPage;
