import EditGoal from "@/components/workspace/goals/EditGoal";

const Contacts = async ({
  params:{goalId},
}: {
  params:{goalId:string},
}) => {
  return ( 
    <EditGoal goalId={goalId}/>
    );
};

export default Contacts;
