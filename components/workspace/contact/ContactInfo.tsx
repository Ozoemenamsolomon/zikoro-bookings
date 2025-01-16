import React from 'react'
import Articleone from './Articleone'
import ArticleTwo from './ArticleTwo'
import { BookingsContact } from '@/types/appointments'

const ContactInfo = ({contact}:{  contact:BookingsContact|null} ) => {
  return (
    <div className="flex flex-col md:flex-row w-full h-full md:divide-x  ">
        <Articleone  />
        <ArticleTwo contact={contact} />
    </div>
  )
}

export default ContactInfo