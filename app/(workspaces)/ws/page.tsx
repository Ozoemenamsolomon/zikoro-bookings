import WsComponent from "@/components/workspace/workspace";
import { getUserData } from "@/lib/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const WsPage = async () => {
    const supabase = createClient()
    const {user} =  await getUserData()
    
    const {data, error} = await supabase
        .from('organization')
        .select('id,organizationAlias')
        .eq('organizationOwnerId', user?.id)

    if(data){
        redirect(`/ws/${data[0].organizationAlias}/schedule`)
    } else {
      redirect('/')
    }
    // return (
    //   <WsComponent />
    // )
}

export default WsPage