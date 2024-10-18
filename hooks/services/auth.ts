"use client";

import { loginSchema,  } from "@/schemas/auth";
import { useState,  } from "react";
import {toast} from "react-toastify";
import * as z from "zod";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/globalUserStore";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/${values?.email
            }/${new Date().toISOString()}`,
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast.success("Registration  Successful");
        router.push(
          `/verify-email?message=Verify your Account&content= Thank you for signing up! A verification code has been sent to your registered email address. Please check your inbox and enter the code to verify your account.&email=${values.email}&type=verify`
        );
      }
    } catch (error) {
      setLoading(false);
    }
  }
  return {
    register,
    loading,
  };
}


export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setLoggedInUser } = useSetLoggedInUser();
  // Assuming this is a hook

  async function logIn(
    values: z.infer<typeof loginSchema>,
    redirectTo: string | null
  ) {
    setLoading(true);
    try {
      console.log("here");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error?.message);
        // console.log(error?.message);
        setLoading(false);
        return;
      }

      if (data && data?.user?.email) {
        await setLoggedInUser(data?.user?.email);
        //  console.log(data?.user?.email);
        toast.success("Sign In Successful");
        router.push(redirectTo ?? "home");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return {
    logIn,
    loading,
  };
}

export const useSetLoggedInUser = () => {
  const { setUser } = useUserStore();

  const setLoggedInUser = async (email: string | null) => {
    if (!email) return;
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("userEmail", email)
      .single();
    if (error) {
      //  console.log({error});
      window.open(
        `/onboarding?email=${email}&createdAt=${new Date().toISOString()}`,
        "_self"
      );
      return;
    }
    console.log(user);
    setUser(user);
    return user;
  };

  return { setLoggedInUser };
};
