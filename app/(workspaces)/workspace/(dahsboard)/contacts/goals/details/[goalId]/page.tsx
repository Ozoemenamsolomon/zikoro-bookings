import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import GoalDetails from "@/components/workspace/goals/GoalDetails";
import { fetchContacts } from "@/lib/server/contacts";

const Contacts = async ({
  searchParams: { s },
  params:{goalId},
}: {
  params:{goalId:string},
  searchParams: { s: string };
}) => {
//   const {data,count,error} = await fetchContacts(goalId)
// if {!data} redirect(urls.contactGoals)
  return ( 
    <ContactLayout data={[]} count={0} searchquery={s} >
      <ContactSubLayout>
        <GoalDetails/>
      </ContactSubLayout>
    </ContactLayout>
    );
};

export default Contacts;
