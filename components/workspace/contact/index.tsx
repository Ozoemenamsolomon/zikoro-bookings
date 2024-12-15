import React, { Suspense } from "react";
import ContactList from "./ContactList";
import ContactNav from "./ContactNav";
import { BookingsContact } from "@/types/appointments";
import EmptyContact from "./EmptyContact";
import { fetchContacts } from "@/lib/server/contacts";
import Loading from "@/components/shared/Loader";
import ContactWrapper from "./ContactWrapper";
import ContactName from "./ContactName";

type ContactProps = {
  children: React.ReactNode;
  searchquery?: string;
};

const ContactLayout: React.FC<ContactProps> = async ({ children,  }) => {
  const {data,count,error} = await fetchContacts()
  // console.log({data,count,error})
  return (
    <div className=" ">
      
      <ContactName/>
      <div className="sm:border rounded-lg bg-white verflow-auto min-h-screen">
          {
            count === 0  ?
            <EmptyContact/>
            :
            <>
              <div className="w-full">
                <ContactNav/>
              </div>

              <ContactWrapper 
                contactItems={
                  <Suspense fallback={<div className="pt-20 w-full flex justify-center"><Loading/></div>}>
                    <ContactList fetchedcontacts={data} />
                  </Suspense>
                }>
                  {children}
              </ContactWrapper>
            </>
          }
      </div>
    </div>
  );
};

export default ContactLayout;
