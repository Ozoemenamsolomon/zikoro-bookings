import GoalDetails from "@/components/workspace/goals/GoalDetails";
import { unstable_noStore } from "next/cache";

const Contacts = async ({
  searchParams: { s },
  params 
}: {
  params:{contactId:string, goalId:string},
  searchParams: { s: string };
}) => {
  unstable_noStore();
  return ( 
      <GoalDetails params={params}/>
    );
};

export default Contacts;
