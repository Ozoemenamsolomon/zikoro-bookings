import KeyResultDetails from "@/components/workspace/goals/KeyResultDetails";

const KeyResult = async ({
  searchParams: { id },
  params:{keyResultId},
}: {
  params:{keyResultId:string},
  searchParams: { id: string };
}) => {
  return ( 
      <KeyResultDetails keyResultId={keyResultId}/>
    );
};

export default KeyResult;
