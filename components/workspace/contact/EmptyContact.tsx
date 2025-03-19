import { NoContsctsIcon,   } from '@/constants'
import React from 'react'
import EmptyList from '../ui/EmptyList'

const EmptyContact = () => {
  
  return (
    <section className="  h-screen w-full  flex pt-32 items-center gap-4 flex-col">
      <EmptyList
        icon={<NoContsctsIcon/>}
        heading='Your Contact List is Empty'
        text='Clients you’ve had appointments with will be saved here automatically. You can view and manage their details all in one place.'
        className='lg:h-[30em] '
      />
</section>
  )
}

export default EmptyContact