import GoalDetails from "@/components/workspace/goals/GoalDetails";

const Contacts = async ({
  searchParams: { s },
  params:{goalId},
}: {
  params:{goalId:string},
  searchParams: { s: string };
}) => {
  return ( 
      <GoalDetails goalId={goalId}/>
    );
};

export default Contacts;
