'use client'

import React, { useState } from 'react'
import GoalCard from './GoalCard'
import EmptyGoal from './EmptyGoal'
import { limit } from '@/constants'
import { Loader2Icon } from 'lucide-react'
import ErrorHandler from '@/components/shared/ErrorHandler'
import { useAppointmentContext } from '@/context/AppointmentContext'
import useUserStore from '@/store/globalUserStore'
import { Goal } from '@/types/goal'
import PaginationMain from '@/components/shared/PaginationMain'
import AddNewGoalBtn from './AddNewGoalBtn'

const Goals =  ({goalsData,countSize,errorString }:{
  goalsData:Goal[]|null,countSize:number,errorString:string|null
}) => {

//   const {data,count,error} = await fetchGoalsByUserId(contactId!)
  const {contact} = useAppointmentContext()
  const { user } = useUserStore()
  const [goals, setGoals] = useState<Goal[] | null>(goalsData||[])
  const [totalPages, setTotalPages] = useState<number>(Math.ceil((countSize || 0) / limit))
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState<string|null>(errorString)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchGoals = async (page: number = 1) => {
    setIsError('')
    setLoading(true)
    try {
      const offset = (page - 1) * limit
      const response = await fetch(`/api/goals/?createdBy=${user?.id}&contactId=${contact?.id}&offset=${offset}&limit=${limit}`)
      const { data, count, error } = await response.json()
      if (error) {
        console.error('Error fetching goals:', error)
        setIsError('Failed to fetch goals. Please try again later.')
        return
      }
      setGoals(data || [])
      setTotalPages(Math.ceil((count || 0) / limit))
    } catch (error) {
      console.error('Server error:', error)
      setIsError('Server error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchGoals(page)
  }
  return (
    <section className='bg-white '>
        {
            loading ?
            <div className='h-screen pt-32 flex justify-center'><Loader2Icon className='animate-spin'/></div>
            :
            isError ?
            <ErrorHandler/>
            :
            goals?.length===0 ? 
            <EmptyGoal/>
            :
        <section className="bg-baseBg  sm:p-3 py-6 min-h-screen w-full space-y-6">
            <header className="flex justify-end">
              <AddNewGoalBtn text='New Goal' />
            </header>
            <div className="space-y-6 mx-auto max-w-4xl pb-6">
                {
                    
                    goals?.map((goal,i)=>
                        <div key={i} className='bg-white  hover:shadow duration-300 border rounded-md p-5 relative '>
                            <GoalCard  goal={goal} />
                        </div>
                )}
            </div>
            <div className="flex justify-center py-2">
                <PaginationMain
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
        }
    </section>
  )
}

export default Goals