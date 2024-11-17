import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import Goals from "@/components/workspace/goals";
import { fetchGoalsByUserId } from "@/lib/server/goals";

const Contacts = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchGoalsByUserId()
  return ( 
    <ContactLayout data={[]} count={0} searchquery={s} >
      <ContactSubLayout>
        <Goals data={data} count={count} error={error}/>
      </ContactSubLayout>
    </ContactLayout>
    );
};

export default Contacts;
