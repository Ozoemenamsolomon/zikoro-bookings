import Onboarding from "@/components/appointments/onboarding/Onboarding";
import Image from "next/image";
import React from "react";

type SearchParamsType = {
  email: string;
  createdAt: string;
  workspaceId?: string;
  workspaceAlias?: string;
};

const OnboardingPage = ({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) => {
  console.log({searchParams})
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
        src="/appointments/signupBannerS.webp"
        alt="banner"
        width={375}
        height={215}
        className="w-full h-full object-cover block lg:hidden"
      />

      {/* dynamic components */}
      <Onboarding searchParams={searchParams} />
    </div>
  );
};

export default OnboardingPage;
