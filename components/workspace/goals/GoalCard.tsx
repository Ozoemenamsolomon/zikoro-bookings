'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Goal } from '@/types/goal'
import DropDownGoalAction from './DropDownGoalAction'
import ChartGoal from './ChartGoal'
import { useGoalContext } from '@/context/GoalContext'

const GoalCard = ({goal,goalId}:{goal:Goal,goalId?:string}) => {
    const {setGoalData} = useGoalContext()
    const [initials, setInitials] = useState('')

    const getInitials = (name: string) => {
        const words = name.split(" ");
        return words.length > 1
          ? words[0][0] + words[1][0]  
          : words[0][0] + words[0][1];  
      };

    useEffect(() => {
      setGoalData(goal)
      setInitials(getInitials(goal?.goalOwnerName!));
    }, [goal])
    
  return (
    <div className='space-y-5'>
        <ChartGoal goal={goal}/>

        {!goalId && <DropDownGoalAction goal={goal}/>}
        
        <div className="space-y- pb-6 border-b ">
            <h4 className="font-semibold">{goal?.goalName}</h4>
            <p className="text-sm w-full">{goal?.description}</p>
        </div>

        <div className="flex justify-between gap-x-2">
            <div className="flex-1 min-w-0 truncate flex gap-2 items-center">
                <div className="rounded-full h-10 w-10 flex justify-center items-center font-bold bg-baseLight uppercase">
                    {initials}
                </div>
                <small className='truncated text-[12px]'>{goal?.goalOwnerName}</small>
            </div>

            <div className="space-y-1 text-[12px]">
                <div className="flex justify-end gap-1 items-center">
                    <p>Start Date:</p>
                    <p className='font-semibold'>{format(new Date(goal?.startDate!), 'dd/MM/yyyy')}</p>
                </div>
                <div className="flex justify-end gap-1 items-center">
                    <p>End Date:</p>
                    <p className='font-semibold'>{format(new Date(goal?.endDate!), 'dd/MM/yyyy')}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GoalCard