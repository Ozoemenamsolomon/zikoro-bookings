
import ContactLayout from '@/components/workspace/contact'
import { fetchContacts } from '@/lib/server/contacts';
import React from 'react'

const Favorites = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  const {data,count,error} = await fetchContacts()
  return ( 
    <ContactLayout data={data} searchquery={s} >
        <main className='text-4xl font-bold p-8'>Favorite Contact</main>
    </ContactLayout>
  )
}
  
export default Favorites