import { urls } from "@/constants"
import { redirect } from "next/navigation"

const page = async ({
  params 
}: {
  params:{contactId: string, workspaceAlias:string; },
}) => {
  const workspaceAlias = (await params).workspaceAlias
  const contactId = (await params).contactId

  redirect(`/ws/${workspaceAlias}/contacts/${contactId}/goals`)
}

export default page