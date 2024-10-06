import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "styled-icons/bootstrap";
import { ThreeLineCircle, XCircle } from "@/constants";
import { useRouter } from "next/navigation";

const AppointmentNav = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOn, setIsPreviewOn] = useState<boolean>(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="py-6 px-3 md:px-6 relative ">
      <div className=" bg-white flex items-center lg:max-w-[970px] xl:max-w-[1165px] py-3 px-3 md:px-6 lg:px-[36px] rounded-[64px] justify-between mx-auto shadow  ">
        <Image
          src="/appointments/zikoroB.png"
          width={115}
          height={40}
          alt=""
          onClick={() => router.push("/bookings")}
        />

        {/* links */}
        <div className="gap-x-8 hidden lg:flex ">
          <p
            className="text-base font-medium cursor-pointer"
            onClick={() => setIsPreviewOn(!isPreviewOn)}
          >
            Other Products <ChevronDown size={20} />
          </p>
          <p
            onClick={() => router.push("/bookings/contact")}
            className="text-base font-medium cursor-pointer"
          >
            Contact us
          </p>
        </div>

        {/* buttons */}
        <div className=" border-[1px] border-gray-200 rounded-[51px] hidden lg:flex gap-x-4 p-3 ">
          <button
            onClick={() => router.push("/bookings/signup")}
            className="text-base px-[20px] py-[10px] text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[28px]"
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push("/bookings/login")}
            className="text-base px-[20px] py-[10px] text-indigo-700 bg-transparent border border-indigo-800 rounded-[28px]"
          >
            Login
          </button>
        </div>

        <div className="lg:hidden">
          <button className="text-black" onClick={toggleMenu}>
            {isOpen ? <XCircle /> : <ThreeLineCircle />}
          </button>
        </div>
      </div>
      {/* preview modal */}
      {isPreviewOn && (
        <div className="absolute hidden lg:block left-96 ">
          <Image
            src="/appointments/otherPreviewB.png"
            className="w-[577px] h-[307px]"
            alt=""
            height={307}
            width={577}
            onClick={() => router.push("/")}
          />
        </div>
      )}
      {isOpen && (
        <div className="bg-violet-100 absolute p-[30px] mt-3 w-full max-w-[92%] lg:hidden rounded-[8px]">
          <ul className="">
            <li
              className="font-medium "
              onClick={() => setIsPreviewOn(!isPreviewOn)}
            >
              Other Products <ChevronDown size={20} />{" "}
              {isPreviewOn && (
                <Image
                  src="/appointments/OtherTopPrevS.png"
                  width={273}
                  height={278}
                  alt=""
                  className="mt-[19px] w-[273px] h-[278px] block lg:hidden"
                  onClick={() => router.push("/")}
                />
              )}
            </li>
            <li
              className="mt-5 font-medium "
              onClick={() => router.push("/bookings/contact")}
            >
              Contact Us{" "}
            </li>
          </ul>

          <div className=" border-[1px] border-gray-300 rounded-[51px] flex gap-x-4 p-3 mt-[72px] items-center w-fit mx-auto ">
            <button
              onClick={() => router.push("/bookings/signup")}
              className="text-base px-[20px] py-[10px] text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[28px]"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push("/bookings/login")}
              className="text-base px-[20px] py-[10px] text-indigo-700 bg-transparent border border-indigo-800 rounded-[28px]"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentNav;
