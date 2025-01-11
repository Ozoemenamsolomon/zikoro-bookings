import ContactLayout from "@/components/workspace/contact";
import ContactInfo from "@/components/workspace/contact/ContactInfo";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Contacts = async ({
  params: { contactId, workspaceAlias },
  searchParams: { s },
}: {
  params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {
 
  unstable_noStore();
    const {data,count,error} = await fetchContacts()
    let contact 
    if(data) {
      contact = data.find(item => item.id === contactId)
      if(!contact) {
        redirect(`/ws`)
      }
    }
  
  return (
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
    <ContactSubLayout>
      <ContactInfo searchquery={s} contact = {contact!}/>;
    </ContactSubLayout>
  </ContactLayout>
  )
};

export default Contacts;
