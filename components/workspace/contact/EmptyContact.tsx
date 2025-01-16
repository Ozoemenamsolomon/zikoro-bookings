import { FolderOpen } from 'lucide-react'
import React from 'react'

const EmptyContact = () => {
  return (
    <section className="  h-screen w-full  flex pt-32 items-center gap-4 flex-col">
    <div className="bg-baseLight rounded-full h-24 w-24 flex items-center justify-center text-purple-700/50">
      <FolderOpen size={60}  />
    </div>
    <h2 className="text-2xl sm:text-4xl font-bold  text-center max-w-96 mx-auto" 
      style={{
        background: 'linear-gradient(269.83deg, #9C00FE 0.14%, #001FCB 99.85%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>You do not have any contact in this workspace</h2>
      <small className="font-semibold">Contact gets updated when a user books an appointment</small>
</section>
  )
}

export default EmptyContact