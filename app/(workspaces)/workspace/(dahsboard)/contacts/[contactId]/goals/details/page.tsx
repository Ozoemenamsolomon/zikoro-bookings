import { urls } from "@/constants"
import { redirect } from "next/navigation"

const page = ({
  params:{contactId},
}: {
  params:{contactId:string},
}) => {
  redirect(`${urls.contacts}/${contactId}/goals`)
}

export default page