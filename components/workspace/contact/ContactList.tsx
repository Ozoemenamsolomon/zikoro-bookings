'use client';

import { Heart, Loader2Icon, Search } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, } from 'next/navigation';
import { BookingsContact } from '@/types/appointments';
import { useAppointmentContext } from '@/context/AppointmentContext';
import EmptyList from '../ui/EmptyList';
import { HeartFill } from 'styled-icons/bootstrap';
import Image from 'next/image';
import { PostRequest } from '@/utils/api';
import { urls } from '@/constants';

type ContactProps = {
  fetchedcontacts: BookingsContact[] | null;
  searchquery?: string;
  contactId?:string
};

const ContactList: React.FC<ContactProps> = ({ fetchedcontacts, searchquery, contactId }) => {
  const { replace, push } = useRouter();
  const pathname = usePathname()

  // eg: ws/[workspace]/contacts/[contactId]/goals
  // const g = pathname?.split('/')
  const pathnameContactId = pathname?.split('/')?.[4] || ''
  const fifthPath = pathname?.split('/')?.[5] || ''
  const { contact, setContact, contacts, setContacts, isfetching, searchTerm, setSearchTerm, setIsFetching,getWsUrl, setActivePath, setIsOpen } = useAppointmentContext();
  const [loading, setLoading] = useState<string | null>(null);

  const filterContacts = useCallback(
    (term: string) => {
      if (!contacts) return [];
      return contacts.filter((item) =>
        `${item.firstName} ${item.lastName}`.toLowerCase().includes(term.toLowerCase())
      );
    },
    [contacts,contact,fetchedcontacts]
  );
  
  useEffect(()=>{
    if(searchquery){
       setSearchTerm(searchquery)
    }
  }, [searchquery])

  useEffect(()=>{
    if(searchquery){
       setSearchTerm(searchquery)
    }
  }, [searchquery])
  
  
  useEffect(() => {
    const updateContactsAndSelected = async () => {
      if (!fetchedcontacts) return; // Avoid processing if no contacts fetched
  
      // If a search term exists, filter contacts
      if (searchTerm) {
        const filtered = filterContacts(searchTerm);
        setContacts((prevContacts) => {
          // Avoid unnecessary updates if filtered contacts are the same
          return JSON.stringify(prevContacts) === JSON.stringify(filtered) ? prevContacts : filtered;
        });
      } else {
        // Reset to fetched contacts
        setContacts(fetchedcontacts);
        // console.log({fetchedcontacts, contactId, pats:pathname?.split('/')})
        // Update selected contact
        if (contactId || pathnameContactId && contact?.id !== pathnameContactId) {
          
          const filteredContact = fetchedcontacts.find((item) => item.id === contactId);
          if(filteredContact){
              setContact((prevContact) =>
                prevContact?.id === filteredContact?.id ? prevContact : filteredContact || null
            );
          } else {
            console.log('no filteredContact')
            setContact(fetchedcontacts?.[0])
          }
        } else if (contact?.id!==pathnameContactId) {
          setContact((prevContact) =>
            prevContact?.id === fetchedcontacts?.[0]?.id ? prevContact : fetchedcontacts?.[0] || null
          );
        }
      }
    };
  
    updateContactsAndSelected();
    setIsFetching(false)
  }, [fetchedcontacts, searchTerm,searchquery, contactId, pathnameContactId]); // Keep dependencies concise
  
  useEffect(() => {
    if(fifthPath) setActivePath(fifthPath)
  }, [fifthPath])
  
  // Handle search input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      replace(`${pathname}?s=${value}`);
    }

  // Function to toggle the favourite status
  const makeFavorite = async ({ favourite, id }: { favourite: boolean; id: string }) => {
    const updatedFavorite = !favourite;
    const updatedContacts = contacts?.map((item) =>
      item.id === id ? { ...item, favourite: updatedFavorite } : item
    );
    setContacts(updatedContacts!);

    try {
      setLoading(id);
      const { data, error } = await PostRequest({url:'/api/bookingsContact/updateContact',body:{favourite: updatedFavorite, id}})
      console.log( { data, error })

      if (error) {
        console.error('Error updating favourite status:', error);
        setContacts(contacts);
      }
      // const updatedContacts = contacts?.map((item) =>
      //   item.id === id ? { ...item, favourite: updatedFavorite } : item
      // );
      // setContacts(updatedContacts!);
      
    } catch (error) {
      console.error('Server error:', error);
      setContacts(contacts); // Revert on failure
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {/* Search input */}
      <div className="bg-baseBg rounded-md border p-1 px-2 w-full flex items-center">
        <Search size={20} className="text-slate-400 shrink-0" />
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search..."
          className="w-full outline-none bg-transparent focus:outline-none rounded-md p-2"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>

      {/* Contact List */}
      <div className="divide-y mt-4">
        {isfetching ? (
          <div className="py-20 flex w-full justify-center">
            <Loader2Icon className="animate-spin text-basePrimary/50" />
          </div>
        ) : contacts?.length ? (
          contacts.map((item) => {
            const { firstName, profileImg, lastName, favourite, id, email, tags } = item
            return (
              <div key={id} 
              onClick={async () => {
                 await setContact(item)
                push(getWsUrl(`${urls.contacts}/${id}/${fifthPath}`))
                setActivePath(fifthPath)
                setIsOpen(true)
                }} className="py-2 w-full cursor-pointer">
              <div
                className={`${
                  contact?.id === id ? 'bg-baseBg ring-1 ring-zikoroBlue' : ''
                } rounded-md w-full p-2 hover:bg-slate-100 duration-300 flex gap-2 items-center`}
              >
                <div className="h-12 w-12 rounded-full bg-baseLight uppercase font-semibold shrink-0 flex items-center justify-center">
                  {profileImg ? (
                    <Image
                      src={profileImg}
                      alt=""
                      width={200}
                      height={200}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'NA'
                  )}
                </div>
            
                {/* Contact Name and Email */}
                <div className="flex-1 min-w-0 text-sm">
                  <h6 className="font-medium leading-4 truncate">{firstName + ' ' + lastName}</h6>
                  <small className="truncate block text-slate-600">{email}</small>
                  <div className="flex gap-1 w-full overflow-auto no-scrollbar">
                    {
                      tags?.map(({tag},i)=>{
                        return (
                          <small key={i} className='text-[8px] min-w-0 shrink-0  px-1 py-0 leading-3 rounded border border-pink-400 bg-pink-500/20'>{tag}</small>
                        )
                      })
                    }
                  </div>
                </div>
            
                {/* Favorite Icon */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    makeFavorite({ favourite: favourite!, id: id! });
                  }}
                  className="shrink-0"
                >
                  {favourite ? (
                    <HeartFill size={20} className="text-basePrimary" />
                  ) : (
                    <Heart size={20} className="text" />
                  )}
                </div>
              </div>
            </div>
            
          )})
        ) : (
          <EmptyList size="34" text="No contacts found" />
        )}
      </div>
    </ >
  );
};

export default React.memo(ContactList);
