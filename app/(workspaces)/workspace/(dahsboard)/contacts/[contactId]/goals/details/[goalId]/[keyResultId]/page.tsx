import KeyResultDetails from "@/components/workspace/goals/KeyResultDetails";

const KeyResult = async ({
  params:{keyResultId},
}: {
  params:{keyResultId:string},
}) => {
  return ( 
      <KeyResultDetails keyResultId={keyResultId}/>
    );
};

export default KeyResult;
