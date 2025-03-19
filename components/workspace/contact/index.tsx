import React, { Suspense } from "react";
import ContactList from "./ContactList";
import ContactNav from "./ContactNav";
import EmptyContact from "./EmptyContact";
 
import Loading from "@/components/shared/Loader";
import ContactWrapper from "./ContactWrapper";
import ContactName from "./ContactName";
import { BookingsContact } from "@/types/appointments";

type ContactProps = {
  children: React.ReactNode;
  searchquery?: string;
  contactId?: string;
  data: BookingsContact[] | null;
  count: number;
};

const ContactLayout: React.FC<ContactProps> = async ({ children,searchquery, data,count, contactId }) => {
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
                    <ContactList searchquery={searchquery} fetchedcontacts={data} contactId={contactId} />
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
