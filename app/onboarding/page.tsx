import Onboarding from "@/components/auth/Onboarding";
type SearchParamsType = {
  email: string,
  createdAt: string
}
export default function Page({searchParams}:{searchParams:SearchParamsType}) {
  return <Onboarding searchParams={searchParams}/>
}