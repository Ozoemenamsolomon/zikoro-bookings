import { urls } from "@/constants"
import { redirect } from "next/navigation"

const page = ({
  searchParams: { id },
  params:{contactEmail},
}: {
  params:{contactEmail:string},
  searchParams: { id: string };
}) => {
  redirect(`${urls.contacts}/${contactEmail}/goals?id=${id}`)
}

export default page