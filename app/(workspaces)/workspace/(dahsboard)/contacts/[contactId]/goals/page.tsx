import Goals from "@/components/workspace/goals";
import { limit, urls } from "@/constants";
import { getUserData } from "@/lib/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";

const Contacts = async ({
  params: {contactId },
}: {
  searchParams: { s: string,};
  params: { contactId: string };
}) => {
  const supabase = createClient()
  const {user} = await getUserData()
  unstable_noStore();
  const { data, count, error } = await supabase
    .from('goals')
    .select('*', { count: 'exact' })
    .eq('createdBy', user?.id)
    .eq('contactId', contactId)
    .range(0, limit - 1)
    .order('created_at', {ascending:false})

  // if(!data) redirect(urls.contacts+'?notFound=The contact was not found')


  return ( 
    <Goals goalsData={data} countSize={count!} errorString={null}  />
    );
};

export const revalidate = 0; // Ensures no caching for the page
export default Contacts;
