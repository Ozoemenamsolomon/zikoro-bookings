"use client";
import { useState } from "react";
import { useForgotPassword } from "@/hooks/services/auth";
import Link from "next/link";
import { LoaderAlt } from "styled-icons/boxicons-regular";

const ForgotPasswordComponent = () => {
  const { loading, forgotPassword } = useForgotPassword();

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('')
    const errorStr   = await forgotPassword(email);
    setError(errorStr||'')
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  max-w-sm  px-3 lg:px-0"
    >
      <p className="font-medium text-lg sm:text-xl text-center ">
        Forgot Password
      </p>
      <p className="mt-2 text-center font-light">
        Enter the email you used for registration.
      </p>
      <div className="mt-6">
        <div className="w-full p-1 border-[1px] border-indigo-800 rounded-xl h-[52px]  ">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-4 outline-none text-xs text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
          />
        </div>
               
        <div className="mt-4">
          {error ? <small className="text-center flex justify-center pb-2 text-red-500"> {error}</small> : null}
          <button
            type="submit"
            className={`text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 w-full rounded-lg  `}
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            Submit 
          </button>
        </div>

        {
        //  error && 
         <div className="flex flex-col pt-2 items-center justify-center text-center">
              <div className="flex gap-4  text-blue-500 items-cenetr text-sm">
                <Link href={`/login?email=${email}`} className="hover:underline duration-300">Signin</Link>
                <Link href={`/signup?email=${email}`} className="hover:underline duration-300">Signup</Link>
              </div>
          </div>
        }
      </div>
    </form>
  );
};

export default ForgotPasswordComponent;
