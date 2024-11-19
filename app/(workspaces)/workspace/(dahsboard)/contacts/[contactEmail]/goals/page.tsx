import Goals from "@/components/workspace/goals";
import { limit } from "@/constants";
import { getUserData } from "@/lib/server";
import { createClient } from "@/utils/supabase/server";

const Contacts = async ({
  searchParams: { id },
  params: {contactEmail },
}: {
  searchParams: { s: string, id:string, name:string };
  params: { contactEmail: string };
}) => {
  const supabase = createClient()
  const {user} = await getUserData()
  // const decodedEmail = decodeURIComponent(contactEmail);

  const { data, count, error } = await supabase
    .from('goals')
    .select('*', { count: 'exact' })
    .eq('createdBy', user?.id)
    .eq('contactId', id)
    .range(0, limit - 1)
    .order('created_at', {ascending:false})

  console.log({ data, count, error })

  return ( 
    <Goals goalsData={data} countSize={count!} errorString={error?.message||''}  />
    );
};

export const revalidate = 0; // Ensures no caching for the page
export default Contacts;
