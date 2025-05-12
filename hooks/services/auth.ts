"use client";

import { loginSchema, onboardingSchema } from "@/schemas/auth";
import { useState, } from "react";
import { toast } from "react-toastify";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { PostRequest } from "@/utils/api";
import useUserStore,  { initializeWorkspaces } from "@/store/globalUserStore";
import { createClient } from "@/utils/supabase/client";
import { urls } from "@/constants";
import { User } from "@/types/appointments";
import { checkUserExists } from "@/lib/server/workspace";
import { Organization } from "@/types";
import { generateAlphanumericHash } from "@/utils/helpers";

const supabase = createClient();

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    const verification_token = generateAlphanumericHash()
    console.log({verification_token})
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data:{ 
            platform:'Bookings',
            verification_token,
            workspaceAlias:values?.workspaceAlias||'',
          },
          //IRRELEVANT, SINCE WE ARE NOW USING VERIFYCODE INSTEAD OF VERIFYEMAIL added workspaceAlias to pass the condition to know if this user was added to a workspace or not
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/${values?.email}/${new Date().toISOString()}/${values?.workspaceAlias||'none'}`,
        },
      });

      if (error) {
        toast.error(error?.message);
        setLoading(false);
        return;
      }
 
      if (data) {
        toast.success("Registration  Successful");
        router.push(
          `/verify-email?message=Verify your Account&content=Thank you for signing up! A verification code has been sent to your registered email address. Please check your inbox and enter the code to verify your account.&email=${values.email}&type=verify${ values?.workspaceAlias ? `&workspaceAlias=${values?.workspaceAlias}` : ''}`
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
  const [loading, setLoading] = useState('');
  const router = useRouter();
  const {setUser} = useUserStore()
  const { setLoggedInUser } = useSetLoggedInUser();

  async function logIn(
    values: z.infer<typeof loginSchema>,tokenEmail:string, userData:User|null
  ) {
    setLoading('Submitting credentials...');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password, 
      });
      // console.log({authUser: data, error})
      if (error) {
        toast.error(error?.message);
        return;
      }

      const user = await checkUserExists(values.email)
      if (!user) {
        console.log('User was not found');
        toast.error('Account was not found. Set up account')
        // TODO: redirect to signup setup
        return;
      }
      setUser(user)

      if (values.workspaceAlias) {
        // this means that user was assigned to this workspace. complete user team membership details
        setLoading('Setting up your workspace')
         const {data:bookingTeam,error} = await PostRequest({
          url:'/api/workspaces/team/update',
          body: {
            email: values?.email,
            workspaceAlias: values.workspaceAlias,
            userId: userData?.id,
            tokenEmail,
          }
        })
        // console.log({bookingTeam})
        if(error){
          toast.error('Process error. Try again')
          return
        }
        // const url = await setLoggedInUser(values?.email, tokenEmail, values.workspaceAlias, values.role, userData );
        toast.success("Sign In Successful");
        router.push(`/ws/${values.workspaceAlias}/${urls.schedule}`);
      } else {
        toast.success("Sign In Successful");
        router.push('/ws')
      }
    } catch (error) {
      toast.error('An errror occured')
      console.log(error);
    } finally {
      setLoading('');
    }
  }

  return {
    logIn,
    loading,
  };
}

export function useLogOut(redirectPath: string = "/") {
  const router = useRouter();
  const { setUser } = useUserStore();

  async function logOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push(redirectPath);
  }

  return {
    logOut,
  };
}

export const useSetLoggedInUser = () => {

  const setLoggedInUser = async (email: string, tokenEmail:string, workspaceAlias:string, role:string, userData:User|null) => {
    if (!email) return;

      if(workspaceAlias && role) {
        //This implies that this is a user that was added to team. update userId in the workspace team
        const {data:bookingTeam,error} = await PostRequest({
          url:'/api/workspaces/team/update',
          body: {
            email,
            workspaceAlias,
            userId: userData?.id,
            tokenEmail,
          }
        })
        console.log({bookingTeam})
        if(error){
          toast.error('Process error. Try again')
        }
        // initializing user with assignWorkspace
        const wkspace = await initializeWorkspaces(userData, bookingTeam?.workspaceAlias!);
        return `/ws/${wkspace?.organizationAlias}/${urls.schedule}`;
      } else {
        // This is normal login without tokens.
        const user = await checkUserExists(email)
         
        if (!user) {
          console.log('User was not found');
          return;
        }
        // initializing user-currentworkspace with currentworkspace from the store
        const wkspace = await initializeWorkspaces(user);
        // return `#`;
        return `/ws/${wkspace?.organizationAlias}/${urls.schedule}`;
      }
  };

  return { setLoggedInUser };
};

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function forgotPassword(email: string) {
    try {
      setLoading(true);
      const existingUser = await checkUserExists(email)
      if (!existingUser) {
        // toast.error('The email is not registered');
        setLoading(false);
        return 'The email is not registered';
      }
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
      });

      if (error) {
        // toast.error(error.message);
        setLoading(false);
        return 'Unable to send email! Check your network';
      }

      if (data) {
        //  saveCookie("user", data);

        router.push(
          `/verify-email?message=Reset Password&content=If the email you entered is registered, we've sent an OTP code to your inbox. Please check your email and follow the instructions to reset your password.&email=${email}&type=reset-password`
        );
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    forgotPassword,
    loading,
  };
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updatePassword(password: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        //  saveCookie("user", data);
        toast.success("Password Reset Successfully");
        router.push(`/login`);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return {
    updatePassword,
    loading,
  };
}

export function useResendLink() {
  const [loading, setLoading] = useState(false);

  async function resendLink(email: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return {
    resendLink,
    loading,
  };
}

export function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  async function verifyCode(email: string, token: string, type: string | null, workspaceAlias?:string) {
    const createdAt = await new Date().toISOString()
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        throw error;
      }

      if (type === "reset-password") {
        router.push(`${window.location.origin}/update-password`);
      } else {
        router.push(
          `${window.location.origin
          }/onboarding?email=${email}&createdAt=${createdAt}${workspaceAlias ? `&workspaceAlias=${workspaceAlias}` : ''}`
        );
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    verifyCode,
  };
}

export const getUser = async (email: string | null) => {
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
  // console.log(user);
  // saveCookie("user", user);
  return user;
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

export function useOnboarding() {
  const [loading, setLoading] = useState<string>("");
  const { setUser, setCurrentWorkSpace, setWorkSpaces } = useUserStore();
  const router = useRouter();
  const params = useSearchParams();

  async function registration(
    values: FormData,
    email: string | null,
    createdAt: string | null,
    workspaceId?: string
  ): Promise<string | null> {
    try {
      setLoading("Creating user");

      let workspaceAlias = workspaceId||''

      // update user email verification if the param has a token
      if(params.get("token")){
        const token = params.get("token")
        const userId = params.get("userId")

        const {data, status} = await PostRequest<any>({
          url: `/verifyuser/${userId}/${token}`,
          body:""
        })
        console.log('Verification check: ',{data, status})
        // update workspaceAlias if it exists
        workspaceAlias=data?.workspaceAlias||''
      }

      // Create user
      const { data: user, error: userError, status } = await PostRequest({
        url: "/api/auth/user",
        body: {
          ...values,
          userEmail: email,
          created_at: createdAt,
        },
      });
      
      if (userError?.code==='23505') {
        toast.warning("This data alreay exist! Try to signin.");
        router.push(`/login?email=${email}`)
        return null;
      }

      if (userError) {
        console.error("User creation failed:", userError);
        toast.error("Failed to create user. Please try again.");
        return null;
      }

      setLoading("Setting up your workspace");

      // Create and setup workspaces
      const { data: workspaces, error: workspaceError } = await PostRequest({
        url: "/api/workspaces/newUser",
        body: {
          email,
          userId: user?.id,
          workspaceAlias,
          organization: values?.organization,
          name: values.firstName + ' ' + values.lastName,
          organizationType: values?.industry,
          country:values.country,
          phoneNumber:values?.phoneNumber,
        },
      });

      if (workspaceError) {
        console.error("Workspace setup failed:", workspaceError);
        toast.error("Workspace creation failed. Please try again.");
        return null;
      }

      if (!workspaces || workspaces.length === 0) {
        toast.error("No workspace was created. Please contact support.");
        return null;
      }

      // Determine the current workspace safely
      const currentWs =
        workspaces.length > 0
          ? workspaces.find((ws: Organization) => ws.organizationAlias === workspaceAlias) || workspaces[0]
          : undefined;

      if (!currentWs) {
        toast.error("No available workspaces. Please contact support.");
        return null
      }

      // Update Zustand store
      setCurrentWorkSpace(currentWs);
      setWorkSpaces(workspaces);
      setUser({
        ...user,
        workspaceRole: workspaceAlias ? "MEMBER" : "ADMIN",
      });

      setLoading("");
      toast.success("Profile updated successfully");

      // Redirect to schedule page
      return `/ws/${currentWs?.organizationAlias}/schedule`;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
      return null;
    } finally {
      setLoading("");
    }
  }

  return {
    registration,
    loading,
  };
}


