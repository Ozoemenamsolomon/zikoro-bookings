import { Button } from '@/components/ui/button'
import { FileStroke } from '@/constants'
import React from 'react'

const EmptyGoal = () => {
  return (
    <section className="h-screen bg-white w-full flex pt-24 justify-center items-center flex-col gap-3 text-center">
        <FileStroke/>
        <h4 className="text-lg font-bold">
        No Goals and key results
        </h4>
        <p>Add Goals to this contact.</p>

        <Button className='bg-basePrimary'>Add Goal</Button>
    </section>
  )
}

export default EmptyGoal