"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronDown } from "styled-icons/bootstrap";
// import { ThreeLineCircle, XCircle } from "@/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PopoverMenu } from "@/components/shared/PopoverMenu";
import { useClickOutside } from "@/lib/useClickOutside";

const AppointmentNav = () => {
  const router = useRouter();
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOn, setIsPreviewOn] = useState<boolean>(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useClickOutside(menuRef, ()=>setIsPreviewOn(false))
  return (
    <div className="py-6 px-3 md:px-6 relative ">
      <div className=" bg-white flex items-center lg:max-w-[970px] xl:max-w-[1165px] py-3 px-3 md:px-6 lg:px-[36px] rounded-[64px] justify-between mx-auto shadow  ">
        <Image
          src="/appointments/zikoroB.png"
          width={115}
          height={40}
          alt=""
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />

        {/* links */}
        <div className="gap-x-8 hidden lg:flex ">
        <PopoverMenu
              trigerBtn={
                <button
                  ref={menuRef} 
                  className="font-medium flex items-center gap-1 "
                  onClick={() => setIsPreviewOn(!isPreviewOn)}
                >
                  <p>Other Products </p><ChevronDown size={20} className={`${isPreviewOn ?'rotate-180':''} transition-all duration-200`} />
                </button> 
            }>
              <div className="">
                <Image
                    ref={menuRef} 
                    src="/appointments/OtherTopPrevS.png"
                    width={273}
                    height={278}
                    alt=""
                    className=" w-[577px] h-[307px] "
                    onClick={() => router.push("/")}
                  />
                </div>
            </PopoverMenu>
          {/* <p
            className="text-base font-medium cursor-pointer flex gap-2 items-center"
            onClick={() => setIsPreviewOn(!isPreviewOn)}
          >
           <p>Other Products</p> <ChevronDown size={20} />
          </p> */}

          <p
            onClick={() => router.push("/contact")}
            className="text-base font-medium cursor-pointer"
          >
            Contact us
          </p>
        </div>

        {/* buttons */}
        <div className=" border-[1px] border-gray-200 rounded-[51px] hidden lg:flex gap-x-4 p-3 ">
           <SignupBtn/>
           <SigninBtn/>
        </div>

        <div className="lg:hidden">
          <button className="text-black" onClick={toggleMenu}>
            {/* {isOpen ? <XCircle /> : <ThreeLineCircle />} */}
          </button>
        </div>
      </div>
      {/* preview modal */}
      {/* {isPreviewOn && (
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
      )} */}

      {isOpen && (
        <div className="bg-violet-100 absolute p-[30px] mt-3 w-full max-w-[92%] lg:hidden rounded-[8px]">
          <ul className="">
            <PopoverMenu
              trigerBtn={
                <button
                  className="font-medium "
                  // onClick={() => setIsPreviewOn(!isPreviewOn)}
                >
                  Other Products <ChevronDown size={20} />
                </button>
            }>
              <div className="">
                <Image
                    src="/appointments/OtherTopPrevS.png"
                    width={273}
                    height={278}
                    alt=""
                    className="mt-[19px] w-[273px] h-[278px] block lg:hidden"
                    onClick={() => router.push("/")}
                  />
                </div>
            </PopoverMenu>
            
            {/* {isPreviewOn && (
                <Image
                  src="/appointments/OtherTopPrevS.png"
                  width={273}
                  height={278}
                  alt=""
                  className="mt-[19px] w-[273px] h-[278px] block lg:hidden"
                  onClick={() => router.push("/")}
                />
              )} */}
            <Link href={"/contact"}
              className="mt-5 font-medium "
            >
              Contact Us{" "}
            </Link>
          </ul>

          <div className=" border-[1px] border-gray-300 rounded-[51px] flex gap-x-4 p-3 mt-[72px] items-center w-fit mx-auto ">
            <SignupBtn/>
            <SigninBtn/>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentNav;

const SignupBtn = () => {
  return (
  <Link
    href={"/signup"} 
    className="text-base px-[20px] py-[10px] text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[28px]"
    >
    Sign Up
  </Link>)
  }
const SigninBtn = () => {
  return (
    <Link
    href={"/login"} 
    className="text-base px-[20px] py-[10px] text-indigo-700 bg-transparent border border-indigo-800 rounded-[28px]"
  >
    Login
  </Link>
  )}