import ContactLayout from "@/components/workspace/contact";
import ContactInfo from "@/components/workspace/contact/ContactInfo";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import { fetchContacts } from "@/lib/server/contacts";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

const Contacts = async ({
  params ,
  searchParams ,
}: {
  params: { workspaceAlias:string; };
  searchParams: { s: string };
}) => {

  const workspaceAlias = (await params).workspaceAlias
  const s = (await searchParams).s

  unstable_noStore();
    const {data,count,error} = await fetchContacts(workspaceAlias)

  return (
    <ContactLayout searchquery={s} data={data} count={count}>
    <ContactSubLayout >
      <ContactInfo contact = {data?.[0] || null}/>;
    </ContactSubLayout>
  </ContactLayout>
  )
};

export default Contacts;
