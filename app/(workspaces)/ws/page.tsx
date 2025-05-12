import WsComponent from "@/components/workspace/workspace";
import { getUserData } from "@/lib/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const WsPage = async () => {
    const supabase = createClient()
    // const {user} =  await getUserData()
        const {
        data: { user },
      } = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from('organization')
        .select('id,organizationAlias, organizationOwner')
        .eq('organizationOwner', user?.email)
        .order('created_at', {ascending:true})

    // console.log({data, error})

    if(data){
        redirect(`/ws/${data[0]?.organizationAlias}/schedule`)
    } else {
      return (
      <WsComponent />
    )
    }
    
}

export default WsPage