import ContactInfo from "@/components/workspace/contact/ContactInfo";
import { unstable_noStore } from "next/cache";

const Contacts = async () => {
  // console.log({contactEmail})
  unstable_noStore();
  return ( 
      <ContactInfo />
    );
};

export default Contacts;
