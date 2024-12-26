import ContactInfo from "@/components/workspace/contact/ContactInfo";
import { unstable_noStore } from "next/cache";

const Contacts = async ({
  params: { workspaceAlias },
  searchParams: { s },
}: {
  params: { workspaceAlias: string };
  searchParams: { s: string };
})=> {
  // console.log({contactEmail})
  unstable_noStore();
  return ( 
      <ContactInfo />
    );
};

export default Contacts;
