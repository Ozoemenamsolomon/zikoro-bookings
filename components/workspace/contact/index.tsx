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
      <h4 className="text-lg font-semibold pb-4">Contacts</h4>
      <ContactName/>
      <div className="sm:border rounded-lg bg-white min-h-screen">
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

              {/* <div className="flex md:divide-x">

                  <Suspense fallback={<div className="pt-20 w-full flex justify-center"><Loading/></div>}>
                    <ContactList fetchedcontacts={data} />
                  </Suspense>

                  <div className={`${true ? 'max-md:hidden':''} w-full md:w-3/4 h-full `}>
                      {children}
                  </div>

              </div> */}
            </>
          }
      </div>
    </div>
  );
};

export default ContactLayout;
