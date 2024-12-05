import React, { Suspense } from "react";
import ContactList from "./ContactList";
import ContactNav from "./ContactNav";
import { BookingsContact } from "@/types/appointments";
import EmptyContact from "./EmptyContact";
import { fetchContacts } from "@/lib/server/contacts";
import Loading from "@/components/shared/Loader";

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
      <div className="sm:border rounded-lg bg-white ">
          {
            count === 0  ?
            <EmptyContact/>
            :
            <>
              <div className="w-full">
                <ContactNav/>
              </div>

              <div className="flex flex-col md:flex-row md:divide-x">
                <Suspense fallback={<div className="pt-20 w-full flex justify-center"><Loading/></div>}>
                  <ContactList fetchedcontacts={data} />
                </Suspense>

                  <div className="w-full md:w-3/4 h-full">
                      {children}
                  </div>

              </div>
            </>
          }
      </div>
    </div>
  );
};

export default ContactLayout;
