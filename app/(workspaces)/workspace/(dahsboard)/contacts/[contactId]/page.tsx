import ContactInfo from "@/components/workspace/contact/ContactInfo";
import { fetchContact } from "@/lib/server/contacts";

const Contacts = async ({
  params: { contactId },
  searchParams: { s },
}: {
  params: { contactId: string };
  searchParams: { s: string };
}) => {
  // const decodedEmail = decodeURIComponent(contactId);
  // const { data, error } = await fetchContact(decodedEmail);
  // console.log({
  //   contactId, // Original URI-encoded email
  //   decodedEmail, // Decoded email string
  //   data, // Response data
  //   error, // Response error (if any)
  // });

  return <ContactInfo searchquery={s} />;
};

export default Contacts;
