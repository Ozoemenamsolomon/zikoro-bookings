import WsComponent from "@/components/workspace/workspace";
import { getUserData } from "@/lib/server";
import { fetchWorkspaces } from "@/lib/server/workspace";
import { redirect } from "next/navigation";

const WsPage = async () => {
    const {user} =  await getUserData()

    const { data: workspaces } = await fetchWorkspaces(user?.id)
    console.log({workspaces})
  
    // this rarely happens: fallback for user's own wkspace not found / user creates a new workspace to continue
    if (!workspaces || workspaces.length === 0) {
      // passing user to cover up for edge case: user not in userUserStore
       return  <WsComponent user={user!} />
    }
  
    const ownersOrg = workspaces.find(wk => wk.organizationOwnerId === user?.id)

    redirect(`/ws/${ownersOrg?.organizationAlias}/schedule`)
}

export default WsPage