import GoalDetails from "@/components/workspace/goals/GoalDetails";
import { unstable_noStore } from "next/cache";

const Contacts = async ({
  searchParams: { s },
  params:{goalId},
}: {
  params:{goalId:string},
  searchParams: { s: string };
}) => {
  unstable_noStore();
  return ( 
      <GoalDetails goalId={goalId}/>
    );
};

export default Contacts;
