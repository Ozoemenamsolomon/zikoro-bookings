import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import EditGoal from "@/components/workspace/goals/EditGoal";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Contacts = async ({
  params: { contactId, goalId },
  searchParams: { s },
}: {
  searchParams: { s?: string };
  params: { contactId: string, goalId:string };
}) => {
  // Disable caching
  unstable_noStore();
  // const {data,count,error} = await fetchContacts()
  // if(!data) {
  //   console.error("Error fetching goals:", error);
  //   redirect(`/ws`)
  // }
    
  return ( 
    // <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
    //   <ContactSubLayout>
        <EditGoal goalId={goalId}/>
    //   </ContactSubLayout>
    // </ContactLayout>
    );
};

export default Contacts;
