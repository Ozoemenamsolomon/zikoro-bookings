import { urls } from "@/constants"
import { redirect } from "next/navigation"

const page = () => {
  redirect(urls.contactsGoals)
}

export default page