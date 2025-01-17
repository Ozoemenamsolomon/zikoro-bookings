import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import KeyResultDetails from "@/components/workspace/goals/KeyResultDetails";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const KeyResult = async ({
  searchParams: { s },
  params
}: {
  params:{workspaceAlias:string, keyResultId:string, contactId:string,goalId:string|number, },
  searchParams: { s: string };
}) => {
  unstable_noStore();
 
  return ( 
     <KeyResultDetails params={params}/>
    );
};

export default KeyResult;
