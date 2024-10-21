"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form";
import { ReactSelect } from "@/components/custom/ReactSelect";
import { Button } from "@/components/custom/Button";
import { onboardingSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, Suspense } from "react";
import { COUNTRY_CODE } from "@/utils/countryCode";
import { useOnboarding } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { generateAlphanumericHash } from "@/utils/helpers";

type SearchParamsType = {
  email: string;
  createdAt: string;
};

export default function Onboarding({
  searchParams: { email, createdAt },
}: {
  searchParams: SearchParamsType;
}) {
  // const search = useSearchParams();
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("+234");

  const { loading, registration } = useOnboarding();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      referralCode: generateAlphanumericHash(10).toUpperCase(),
    },
  });

  const countriesList = useMemo(() => {
    return COUNTRY_CODE.map((country) => ({
      label: country.name,
      value: country.name,
    }));
  }, []);

  // const query = search.get("email");
  // const createdAt = search.get("createdAt");

  async function onSubmit(values: z.infer<typeof onboardingSchema>) {
    const payload: z.infer<typeof onboardingSchema> = {
      ...values,

      phoneNumber: phoneCountryCode + values.phoneNumber,
    };
    await registration(payload, email, createdAt);
  }

  return (
    <>
      <div className="w-full flex flex-col gap-y-1 mb-6 items-start justify-start">
        <h2 className="font-medium w-full text-center text-base sm:text-lg ">{`Welcome ${
          email ?? ""
        } 👋`}</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start w-full flex-col gap-y-3"
        >
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <InputOffsetLabel label="First Name">
                  <Input
                    type="text"
                    placeholder="Enter first name"
                    {...field}
                    className=" placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-400 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <InputOffsetLabel label="Last Name">
                  <Input
                    type="text"
                    placeholder="Enter last name"
                    {...field}
                    className=" placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-400 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <InputOffsetLabel label="City">
                  <Input
                    type="text"
                    placeholder="Enter City"
                    {...field}
                    className=" placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-400 text-gray-700"
                  />
                </InputOffsetLabel>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <InputOffsetLabel label={"Country"}>
                  <ReactSelect
                    {...field}
                    placeHolder="Select the Country"
                    label="Event Country"
                    options={countriesList}
                  />
                </InputOffsetLabel>
              )}
            />
          </div>
          <div className="w-full grid grid-cols-1 items-center gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <InputOffsetLabel label="Phone Number">
                  <div className="w-full relative h-11">
                    <input
                      type="text"
                      className="!mt-0 text-sm absolute top-[30%] bg-transparent left-2 text-gray-700 z-10 font-medium h-fit w-fit max-w-[36px] outline-none"
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                    />
                    <Input
                      className="placeholder:text-sm h-11 placeholder:text-gray-400 text-gray-700 pl-12"
                      placeholder="Enter phone number"
                      {...field}
                      type="tel"
                    />
                  </div>
                </InputOffsetLabel>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="referredBy"
            render={({ field }) => (
              <InputOffsetLabel label="Referral Code">
                <Input
                  type="text"
                  placeholder="Referral Code (Optional)"
                  {...field}
                  className=" placeholder:text-sm h-11 focus:border-gray-500 placeholder:text-gray-400 text-gray-700"
                />
              </InputOffsetLabel>
            )}
          />

          <div className="flex items-center flex-wrap gap-x-2 text-[11px] sm:text-[13px] leading-5 w-full">
            {` By clicking on 'create account', you agree to`}{" "}
            <span className="text-basePrimary underline">{`Zikoro's Privacy Policy`}</span>{" "}
            and{" "}
            <span className="text-basePrimary underline">Terms of Use.</span>
          </div>

          <Button
            disabled={loading}
            className="mt-4 w-full gap-x-2 hover:bg-opacity-70 bg-basePrimary h-12 rounded-md text-gray-50 font-medium"
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <span>Update Profile</span>
          </Button>

          {/**
           <div className="w-full flex items-center gap-x-1 justify-center">
            <p>Already have an account?</p>
            <Link href="/login" className="text-basePrimary font-medium">
              Sign in
            </Link>
          </div>
         */}
        </form>
      </Form>
    </>
  );
}

// export default function Onboarding() {
//   return (
//     <Suspense>
//       <OnboardingComp />
//     </Suspense>
//   );
// }
