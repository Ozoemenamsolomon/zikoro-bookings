import Goals from "@/components/workspace/goals";

import { unstable_noStore } from "next/cache";
 
import { redirect } from "next/navigation";
import { fetchGoalsByUserId } from "@/lib/server/goals";

const Contacts = async ({
  params: { contactId },
  searchParams: { s },
}: {
  searchParams: { s: string };
  params: { contactId: string };
}) => {
  // Disable caching
  unstable_noStore();

  const { data: goalsData, count: goalsCount, error: goalsError } = await fetchGoalsByUserId(contactId)

  // console.log({goalsData})

  // Handle errors
  if (goalsError) {
    console.error("Error fetching goals:", goalsError);
    redirect(`/ws`)
  }

  return (
    <Goals goalsData={goalsData} countSize={goalsCount || 0} errorString={goalsError || null} />
  );
};

export default Contacts;
