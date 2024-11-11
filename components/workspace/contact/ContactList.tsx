'use client';

import { Heart, Loader2Icon, Search } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookingsContact } from '@/types/appointments';
import { useAppointmentContext } from '@/context/AppointmentContext';
import EmptyList from '../ui/EmptyList';
import { HeartFill } from 'styled-icons/bootstrap';
import Image from 'next/image';
import { PostRequest } from '@/utils/api';

type ContactProps = {
  fetchedcontacts: BookingsContact[] | null;
  searchquery?: string;
};

const ContactList: React.FC<ContactProps> = ({ fetchedcontacts, searchquery }) => {
  const { replace } = useRouter();
  const { contact, setContact, contacts, setContacts, isfetching, setIsFetching } = useAppointmentContext();
  const [searchTerm, setSearchTerm] = useState(searchquery || '');
  const [loading, setLoading] = useState<number | null>(null);

  // console.log({fetchedcontacts})

  // Function to filter contacts based on search term
  const filterContacts = useCallback(() => {
    if (!contacts) return;
    const filtered = contacts.filter((item) =>
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setContacts(filtered);
  }, [searchTerm, contacts, setContacts]);

  // Effect to filter contacts or reset to initial fetched contacts
  useEffect(() => {
    if (searchTerm) {
      filterContacts();
    } else {
      setContacts(fetchedcontacts || []);
      setContact(fetchedcontacts?.[0] || null);
    }
    setIsFetching(false);
  }, [fetchedcontacts, searchTerm, ]);

  // Handle search input changes
  const handleChange = 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setTimeout(() => {
        replace(`/workspace/contacts/?s=${value}`);
      }, 500);
    }

  // Function to toggle the favorite status
  const makeFavorite = async ({ favorite, id }: { favorite: boolean; id: number }) => {
    const updatedFavorite = !favorite;
    const updatedContacts = contacts?.map((item) =>
      item.id === id ? { ...item, favorite: updatedFavorite } : item
    );
    setContacts(updatedContacts!);

    try {
      setLoading(id);
      const { data, error } = await PostRequest({url:'/api/bookingsContact/updateContact',body:{favorite: updatedFavorite, id}})
      // console.log( { data, error })

      if (error) {
        console.error('Error updating favorite status:', error);
        setContacts(contacts);
      }
      // const updatedContacts = contacts?.map((item) =>
      //   item.id === id ? { ...item, favorite: updatedFavorite } : item
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
    <div className="w-full md:w-1/4 p-4 md:px-2 h-full sticky top-0 bg-white">
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
            const { firstName, profileImg, lastName, favorite, id, email } = item
            return (
            <div key={id} 
              onClick={() => setContact(item)} className="py-2 w-full cursor-pointer">
              <div
                className={`${
                  contact?.id === id ? 'bg-baseBg ring-1 ring-slate-300' : ''
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

                <div className="w-full">
                  <h6 className="font-medium leading-4">{firstName + ' ' + lastName}</h6>
                  <small>{email}</small>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    makeFavorite({ favorite: favorite!, id:id! });
                  }}
                  className="shrink-0"
                >
                  {favorite ? <HeartFill size={20} className="text-basePrimary" /> : <Heart size={20} className="text" />}
                </div>
              </div>
            </div>
          )})
        ) : (
          <EmptyList size="34" text="No contacts found" />
        )}
      </div>
    </div>
  );
};

export default React.memo(ContactList);
