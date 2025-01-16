import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import GoalDetails from "@/components/workspace/goals/GoalDetails";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Contacts = async ({
  searchParams: { s },
  params 
}: {
  params:{contactId:string, goalId:string, workspaceAlias:string},
  searchParams: { s: string };
}) => {
  unstable_noStore();

  return ( 
      <GoalDetails params={params}/>
    );
};

export default Contacts;
