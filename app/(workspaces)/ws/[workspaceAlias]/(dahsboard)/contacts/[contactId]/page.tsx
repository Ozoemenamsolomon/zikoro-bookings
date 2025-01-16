import ContactLayout from "@/components/workspace/contact";
import ContactInfo from "@/components/workspace/contact/ContactInfo";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";

const Contacts = async ({
  params ,
  searchParams ,
}: {
  params: { contactId: string, workspaceAlias:string; };
  searchParams: { s: string };
}) => {

  const workspaceAlias = (await params).workspaceAlias
  const contactId = (await params).contactId
  const s = (await searchParams).s
 
  unstable_noStore();

    const {data,count,error} = await fetchContacts(workspaceAlias)
    let contact 
    if(data) {
      contact = data.find(item => item.id === contactId)
    }
  
  return (
    <ContactLayout contactId={contactId} searchquery={s} data={data} count={count}>
    <ContactSubLayout >
      <ContactInfo contact = {contact!}/>;
    </ContactSubLayout>
  </ContactLayout>
  )
};

export default Contacts;
