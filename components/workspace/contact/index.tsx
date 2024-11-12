import React from "react";
import ContactList from "./ContactList";
import ContactNav from "./ContactNav";
import { BookingsContact } from "@/types/appointments";
import EmptyList from "../ui/EmptyList";
import { FolderOpen } from "lucide-react";

type ContactProps = {
  children: React.ReactNode;
  data: BookingsContact[] | null
  searchquery?: string;
  count:number
};

const ContactLayout: React.FC<ContactProps> = async ({ children, data,count, searchquery }) => {
  
  return (
    <div className=" ">
      <h4 className="text-lg font-semibold pb-4">Contacts</h4>
      <div className="sm:border rounded-lg bg-white ">
          {
            count === 0  ?
            <section className="  h-screen w-full bg-white/70 flex justify-center items-center gap-4 flex-col">
                <FolderOpen size={60} />
                <h2 className="text-basePrimary text-xl text-center md:text-3xl fornt-bold">You do not have any contact.</h2>
            </section>
          :
          <>
            <div className="w-full">
              <ContactNav/>
            </div>

            <div className="flex flex-col md:flex-row md:divide-x">
              <ContactList fetchedcontacts={data} searchquery={searchquery} />

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
