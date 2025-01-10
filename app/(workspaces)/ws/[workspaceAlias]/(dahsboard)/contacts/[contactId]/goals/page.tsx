import Goals from "@/components/workspace/goals";
import { limit } from "@/constants";
import { getUserData } from "@/lib/server";

import { unstable_noStore } from "next/cache";
import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import { createADMINClient } from "@/utils/supabase/no-caching";
import { fetchContacts } from "@/lib/server/contacts";
import { redirect } from "next/navigation";

const Contacts = async ({
  params: { contactId },
  searchParams: { s },
}: {
  searchParams: { s: string };
  params: { contactId: string };
}) => {
  // Disable caching
  unstable_noStore();

  // Create Supabase admin client
  const supabase = createADMINClient();

  // Get user data
  const { user } = await getUserData();

  // Prepare fetch promises
  // const fetchContactsData = fetchContacts();
  const fetchGoals = supabase
    .from("goals")
    .select("*", { count: "exact" })
    .eq("createdBy", user?.id)
    .eq("contactId", contactId)
    .range(0, limit - 1)
    .order("created_at", { ascending: false });

  // Execute fetches concurrently
  const [
    { data: goalsData, count: goalsCount, error: goalsError },
    // { data: contactsData, count: contactsCount, error: contactsError },
  ] = await Promise.all([fetchGoals,  ]);

  // Handle errors
  if (goalsError) {
    console.error("Error fetching goals:", goalsError);
    redirect(`/ws`)
  }

  // Render the layout
  return (
    // <ContactLayout contactId={contactId} searchquery={s} data={contactsData} count={contactsCount}>
    //   <ContactSubLayout>
        <Goals goalsData={goalsData} countSize={goalsCount || 0} errorString={goalsError || null} />
    //   </ContactSubLayout>
    // </ContactLayout>
  );
};

export default Contacts;
