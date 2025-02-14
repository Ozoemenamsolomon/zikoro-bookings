"use client";
import {
  SpCheck,
  SProgress1,
  SProgress2,
  SProgress3,
  SProgress4,
  SProgress5,
} from "@/constants";
import React, { useState } from "react";
import { useOnboarding } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { countryList } from "@/constants/countryList";
import { industryList } from "@/constants/industryList";

type SearchParamsType = {
  email: string;
  createdAt: string;
  workspaceId?: string;
  workspaceAlias?: string;
};

type FormData = {
  referralCode: string;
  referredBy: string;
  phoneNumber: string;
  city: string;
  country: string;
  firstName: string;
  lastName: string;
  industry: string;
  organization: string;
};

export function generateAlphanumericHash(length?: number): string {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const hashLength = length || 18;
  let hash = "";

  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters.charAt(randomIndex);
  }

  return hash;
}

export default function OnboardingForm({
  searchParams: { email, createdAt, workspaceId, workspaceAlias },
}: {
  searchParams: SearchParamsType;
}) {
  const [isReferralCode, setIsReferralCode] = useState<boolean>(false);
  const { loading, registration } = useOnboarding();
  const [url, setUrl] = useState('/')
  const [formData, setFormData] = useState({
    referralCode: "",
    referredBy: "",
    phoneNumber: "",
    city: "",
    country: "",
    firstName: "",
    lastName: "",
    industry: "",
    organization: "",
  });

  const router = useRouter();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const stages = ["stage1", "stage2", "stage3", "stage4", "stage5"];

  // State to track the current paragraph index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Handlers for next

  const handleNext = () => {
    if (currentIndex < stages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  //Handlers for previous
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  //create user
  async function handleCreateUser(e: React.FormEvent, values: FormData) {
    e.preventDefault();
    const payload = {
      ...values,
      phoneNumber: values.phoneNumber
        ? `+${values.phoneNumber.replace(/^(\+)?/, "")}`
        : "",
      referralCode: generateAlphanumericHash(10).toUpperCase(),
      referredBy: values.referredBy.toUpperCase(),
    };
    try {
      const path = await registration(payload, email, createdAt, workspaceAlias);
      setUrl(path?path:url)
      if(path) handleNext();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <div>
      {/* 1st */}
      {currentIndex === 0 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px]">
          <div className="flex mx-auto justify-center">
            <SProgress1 />
          </div>
          <div className="mt-6 lg:mt-[52px] ">
            <p className="text-black text-[20px] font-semibold w-full text-center">
              Do you have a referral code?
            </p>
            {/* buttons */}
            <div className="w-full flex">
              <div className="flex gap-x-[8px] mt-8 mx-auto ">
                <div
                  className="flex flex-col cursor-pointer rounded-[8px] gap-y-[18px] pt-[11px] bg-white border-[1px] border-gray-200 hover:border-indigo-800 w-[100px] h-[100px]"
                  onClick={() => setIsReferralCode(false)}
                >
                  <div className="flex mx-auto">
                    <input
                      type="radio"
                      name="referral"
                      id="referral-no"
                      className="radio-input"
                      checked={!isReferralCode} // Sync with state
                      readOnly // Prevent direct manipulation
                    />
                  </div>
                  <p className="text-[14px] font-normal text-center">No</p>
                </div>

                <div
                  className="flex flex-col cursor-pointer rounded-[8px] gap-y-[18px] pt-[11px] bg-white border-[1px] border-gray-200 hover:border-indigo-800 w-[100px] h-[100px]"
                  onClick={() => setIsReferralCode(true)}
                >
                  <div className="flex mx-auto">
                    <input
                      type="radio"
                      name="referral"
                      id="referral-yes"
                      className="radio-input"
                      checked={isReferralCode} // Sync with state
                      readOnly // Prevent direct manipulation
                    />
                  </div>
                  <p className="text-[14px] font-normal text-center">Yes</p>
                </div>
              </div>
            </div>

            {/* ref code */}
            {isReferralCode && (
              <div className="mt-6 w-full md:w-[458px] mx-auto">
                <p>Referral</p>
                <input
                  type="text"
                  placeholder="Enter Referral Code "
                  className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[10px] py-4 rounded-[6px] mt-3"
                  value={formData.referredBy}
                  name="referredBy"
                  id=""
                  onChange={handleChange}
                />
              </div>
            )}

            {/* nav buttons */}
            <div className="flex items-center justify-center mx-auto  mt-6 ">
              <button
                onClick={handleNext}
                disabled={currentIndex === stages.length - 1}
                className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
              >
                Next
              </button>{" "}
            </div>
          </div>
        </div>
      )}

      {/* 2nd */}
      {currentIndex === 1 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px]">
          <p className="w-full lg:w-[835px] font-medium text-center hidden lg:block">
            We need this information to personalize your experience, tailor
            services to your location, and ensure secure account setup.
          </p>
          <p className="w-full lg:w-[835px] font-medium text-center block lg:hidden">
            We ask for your phone number, city, and country to personalize your
            experience, tailor services to your location, and ensure secure
            account setup.
          </p>
          <div className="max-w-full lg:max-w-[458px] mx-auto">
            <div className="flex mx-auto justify-center">
              <SProgress2 />
            </div>
            <div className="mt-6 lg:mt-[52px] ">
              {/* 1st input */}
              <div>
                <p className="text-black text-[14px] ">Phone Nuber</p>
                <div className="flex gap-x-[10px] items-center border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[10px] py-4 rounded-[6px] mt-3">
                  <p>+</p>
                  <input
                    type="tel"
                    placeholder="234 001 002 0003"
                    className=" text-[#1f1f1f] placeholder-gray-500 bg-transparent outline-none w-full"
                    name="phoneNumber"
                    id=""
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    autoComplete="off"
                    min={11}
                    max={13}
                  />
                </div>
              </div>

              <div className="mt-[29px]">
                <p className="text-black text-[14px] ">City</p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[10px] py-4 rounded-[6px] mt-3 ">
                  <input
                    type="text"
                    placeholder="Enter Your City"
                    className=" text-[#1f1f1f] placeholder-gray-500 bg-transparent outline-none w-full"
                    name="city"
                    id=""
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              <div className="mt-[29px]">
                <p className="text-black text-[14px] ">Country</p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[9px] py-[16px] rounded-[6px] mt-3">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    id=""
                    className="w-full  bg-transparent rounded-md border-[1px] text-gray-500 text-base border-none  outline-none "
                  >
                    <option
                      disabled
                      selected
                      value=""
                      className="bg-transparent text-gray-500"
                    >
                      Select Your Country
                    </option>
                    {countryList.map((country) => (
                      <option
                        value={country}
                        className="bg-transparent text-gray-500"
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-center gap-x-4 mx-auto mt-[52px] ">
                <button
                  onClick={handlePrev}
                  className="text-indigo-500 font-semibold text-base border-[1px] border-indigo-500  py-3 px-4 rounded-lg"
                >
                  Prev
                </button>{" "}
                <button
                  onClick={() => {
                    if (!formData.city) {
                      toast.error("Please fill out all required fields!");
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={currentIndex === stages.length - 1}
                  className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
                >
                  Next
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 3rd */}
      {currentIndex === 2 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px]">
          <p className=" w-full lg:w-[835px] font-medium text-center">
            Your name allows us to personalize communication and also address
            you properly.
          </p>
          <div className="max-w-full lg:max-w-[458px] mx-auto mt-8">
            <div className="flex mx-auto justify-center">
              <SProgress3 />
            </div>
            <div className="mt-6 lg:mt-[52px] ">
              {/* 1st input */}
              <div>
                <p className="text-black text-[14px] ">First Name</p>
                <div className=" gap-x-[10px] border-[1px] border-gray-200 hover:border-indigo-600 w-full pl-[10px] py-4 rounded-[6px] mt-3">
                  <input
                    type="text"
                    placeholder="Enter First Name "
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none "
                    name="firstName"
                    id=""
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mt-[29px]">
                <p className="text-black text-[14px] ">Last Name</p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[10px] py-4 rounded-[6px] mt-3">
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none w-full"
                    name="lastName"
                    id=""
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-center gap-x-4 mx-auto mt-[52px] ">
                <button
                  onClick={handlePrev}
                  className="text-indigo-500 font-semibold text-base border-[1px] border-indigo-500  py-3 px-4 rounded-lg"
                >
                  Prev
                </button>{" "}
                <button
                  onClick={() => {
                    if (!formData.firstName || !formData.lastName) {
                      toast.error("Please fill out all required fields!");
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={currentIndex === stages.length - 1}
                  className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
                >
                  Next
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4th */}
      {currentIndex === 3 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[835px] mt-6 lg:mt-10 mx-auto pb-[100px]">
          <p className=" w-full xl:w-[835px] text-[14px] lg:text-base font-medium text-center">
            Understanding your industry helps us provide features, resources,
            and updates that align with your professional needs.
          </p>
          <div className="max-w-[458px] mx-auto">
            <div className="flex mx-auto justify-center">
              <SProgress4 />
            </div>
            <div className="mt-6 lg:mt-[52px] ">
              {/* 1st input */}

              <div className="mt-[29px]">
                <p className="text-black text-[11px] lg:text-[14px] ">
                  Which of these options best describes your industry
                </p>
                <div className=" border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[9px] py-[16px] rounded-[6px] mt-3">
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    id=""
                    className="w-full  bg-transparent rounded-md border-[1px] text-black text-base border-none  outline-none "
                  >
                    <option
                      disabled
                      selected
                      value=""
                      className="text-[14px] lg:text-base bg-transparent text-black"
                    >
                      Select Your Industry
                    </option>
                    {industryList.map((industry) => (
                      <option
                        value={industry}
                        className=" text-[14px] lg:text-base bg-transparent text-black"
                      >
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* organization */}
              <div>
                <p className="text-black text-[14px] ">Organization Name</p>
                <div className=" gap-x-[10px] border-[1px] border-gray-200 hover:border-indigo-600 w-full px-[10px] py-4 rounded-[6px] mt-3">
                  <input
                    type="text"
                    placeholder="Enter Organization Name "
                    className=" text-[#1f1f1f] placeholder-black bg-transparent outline-none w-full"
                    name="organization"
                    id="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* nav buttons */}
              <div className="flex items-center justify-center gap-x-4 mx-auto mt-[52px] ">
                <button
                  onClick={handlePrev}
                  className="text-indigo-500 font-semibold text-base border-[1px] border-indigo-500  py-3 px-4 rounded-lg"
                >
                  Prev
                </button>{" "}
                <button
                  onClick={(e) => {
                    handleCreateUser(e, formData);
                  }}
                  disabled={currentIndex === stages.length - 1}
                  className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
                >
                  {loading ? (
                    <div className="flex">
                      <LoaderAlt size={22} className="animate-spin" />
                      <p>{loading}</p>
                    </div>
                  ) : (
                    "Create Profile"
                  )}
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 5th */}
      {currentIndex === 4 && (
        <div className="px-3 lg:px-0 max-w-full lg:max-w-[603px] mt-6 lg:mt-10 mx-auto pb-[100px]">
          <div className="flex mx-auto justify-center">
            <SProgress5 />
          </div>
          <div className="mt-[24px] lg:mt-[52px] ">
            <div className="flex justify-center">
              <SpCheck />
            </div>
            <p className="text-black text-[20px] font-semibold text-center mt-6 ">
              Congratulations {formData.firstName}{" "}
            </p>

            <p className="text-black font-medium text-center mt-3">
              Your profile has been created successfully, start exploring zikoro
              bookings!{" "}
            </p>

            {/* buttons */}
            <div className="flex justify-center gap-x-4 mx-auto mt-[52px] ">
              <button
                onClick={() => router.push(url)}
                className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-3 px-4 rounded-lg"
              >
                Start Exploring
              </button>{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
