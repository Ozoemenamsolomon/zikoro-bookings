
import ContactLayout from '@/components/workspace/contact'
import React from 'react'

const Favorites = async ({
  searchParams: { s },
}: {
  searchParams: { s: string };
}) => {
  return ( 
    <ContactLayout searchquery={s} >
        <main className='text-4xl font-bold p-8'>Favorite Contact</main>
    </ContactLayout>
  )
}
  
export default Favorites