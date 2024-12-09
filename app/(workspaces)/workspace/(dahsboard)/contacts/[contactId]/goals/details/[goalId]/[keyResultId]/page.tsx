import KeyResultDetails from "@/components/workspace/goals/KeyResultDetails";
import { unstable_noStore } from "next/cache";

const KeyResult = async ({
  params:{keyResultId},
}: {
  params:{keyResultId:string},
}) => {
  unstable_noStore();
  return ( 
      <KeyResultDetails keyResultId={keyResultId}/>
    );
};

export default KeyResult;
