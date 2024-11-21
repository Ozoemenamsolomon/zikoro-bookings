import ContactInfo from "@/components/workspace/contact/ContactInfo";
import { fetchContact } from "@/lib/server/contacts";

const Contacts = async ({
  params: { contactEmail },
  searchParams: { s },
}: {
  params: { contactEmail: string };
  searchParams: { s: string };
}) => {
  // const decodedEmail = decodeURIComponent(contactEmail);
  // const { data, error } = await fetchContact(decodedEmail);
  // console.log({
  //   contactEmail, // Original URI-encoded email
  //   decodedEmail, // Decoded email string
  //   data, // Response data
  //   error, // Response error (if any)
  // });

  return <ContactInfo searchquery={s} />;
};

export default Contacts;
