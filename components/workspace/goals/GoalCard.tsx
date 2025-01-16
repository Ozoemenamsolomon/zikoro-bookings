'use client';

import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Goal } from '@/types/goal';
import DropDownGoalAction from './DropDownGoalAction';
import ChartGoal from './ChartGoal';
import { useGoalContext } from '@/context/GoalContext';
import Image from 'next/image';
import RenderOnerProfile from './RenderOnerProfile';

interface GoalCardProps {
  goal: Goal;
  goalId?: string;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, goalId }) => {
  const { setGoalData } = useGoalContext();

  useEffect(() => {
    setGoalData(goal);
  }, [goal, setGoalData]);

  const renderOwnerProfile = () => {
    const owner = goal?.goalOwner?.userId;
    const initials = `${owner?.firstName?.[0] || 'N'}${owner?.lastName?.[0] || 'A'}`;

    return owner?.profilePicture ? (
      <Image
        src={owner.profilePicture}
        alt="profile"
        width={40}
        height={40}
        className="object-cover w-full h-full rounded-full"
      />
    ) : (
      <div className="rounded-full h-10 w-10 flex justify-center items-center font-bold bg-baseLight uppercase">
        {initials}
      </div>
    );
  };

  const renderDate = (label: string, date: string | undefined) => (
    <div className="flex justify-end gap-1 items-center">
      <p>{label}:</p>
      <p className="font-semibold">{date ? format(new Date(date), 'dd/MM/yyyy') : 'N/A'}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <ChartGoal goal={goal} />

      {!goalId && <DropDownGoalAction goal={goal} />}

      <div className="space-y-3 pb-6 border-b">
        <h4 className="font-semibold">{goal?.goalName}</h4>
        <p className="text-sm w-full">{goal?.description}</p>
      </div>

      <div className="flex justify-between gap-x-2">
        <RenderOnerProfile owner={goal.goalOwner?.userId} />

        <div className="space-y-1 text-[12px]">
          {renderDate('Start Date', goal?.startDate!)}
          {renderDate('End Date', goal?.endDate!)}
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
