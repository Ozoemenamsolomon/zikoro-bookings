import KeyResultDetails from "@/components/workspace/goals/KeyResultDetails";
import { unstable_noStore } from "next/cache";

const KeyResult = async ({
  params
}: {
  params:{keyResultId:string,contactId:string,goalId:string|number},
}) => {
  unstable_noStore();
  return ( 
      <KeyResultDetails  params={params}/>
    );
};

export default KeyResult;
