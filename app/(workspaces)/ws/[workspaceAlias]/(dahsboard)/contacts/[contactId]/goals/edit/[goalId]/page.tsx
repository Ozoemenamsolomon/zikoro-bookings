import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import EditGoal from "@/components/workspace/goals/EditGoal";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Contacts = async ({
  params ,
 
}: {
 
  params: { contactId: string, goalId:string, workspaceAlias:string; };
}) => {

  // const workspaceAlias = (await params).workspaceAlias
  // const contactId = (await params).contactId
  const goalId = (await params).goalId

  unstable_noStore();
    
  return ( 
    <EditGoal goalId={goalId}/>
    );
};

export default Contacts;
