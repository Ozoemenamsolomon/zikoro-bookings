import EditGoal from "@/components/workspace/goals/EditGoal";

const Contacts = async ({
  searchParams: { s },
  params:{goalId},
}: {
  params:{goalId:string},
  searchParams: { s: string };
}) => {
  return ( 
    <EditGoal goalId={goalId}/>
    );
};

export default Contacts;
