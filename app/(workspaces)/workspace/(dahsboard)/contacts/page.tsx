import ContactLayout from "@/components/workspace/contact";
import ContactInfo from "@/components/workspace/contact/ContactInfo";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import { fetchContacts } from "@/lib/server/contacts";


const Contacts = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  // console.log({data,count,error})
  return ( 
    <ContactLayout data={data} searchquery={s} >
      <ContactSubLayout>
        <ContactInfo />
      </ContactSubLayout>
    </ContactLayout>
    );
};

export default Contacts;
