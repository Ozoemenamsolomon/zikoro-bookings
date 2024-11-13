import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import Goals from "@/components/workspace/goals";
import { fetchContacts } from "@/lib/server/contacts";

const Contacts = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
//   const {data,count,error} = await fetchContacts()
  return ( 
    <ContactLayout data={[]} count={0} searchquery={s} >
      <ContactSubLayout>
        <Goals/>
      </ContactSubLayout>
    </ContactLayout>
    );
};

export default Contacts;
