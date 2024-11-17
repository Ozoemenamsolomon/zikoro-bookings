import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";
import EditGoal from "@/components/workspace/goals/EditGoal";

const Contacts = async ({
  searchParams: { s },
  params:{goalId},
}: {
  params:{goalId:string},
  searchParams: { s: string };
}) => {
  return ( 
    <ContactLayout data={[]} count={0} searchquery={s} >
      <ContactSubLayout>
        <EditGoal goalId={goalId}/>
      </ContactSubLayout>
    </ContactLayout>
    );
};

export default Contacts;
