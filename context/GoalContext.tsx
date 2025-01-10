"use client"

import { fetchTeamMembers } from '@/lib/server/workspace';
import useUserStore from '@/store/globalUserStore';
import { BookingTeamMember,   } from '@/types';
import { Goal, KeyResult } from '@/types/goal';
import React, { createContext, useContext, useState, ReactNode, useEffect, } from 'react';

export interface MetricValueType {
  startValue:number
  targetValue:number
  unit:string
}
export interface KeyResultsType  {
    name: string;
    description: string;
    owner: string;
    startDate: Date | null;
    endDate: Date | null;
    metricType: 'value' | 'milestone' | 'boolean'
    metric: Record<string, any>[] ;
    // metric: Record<string, any>;
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' 
  }
export interface GoalFormData {
    name: string;
    description: string;
    owner: string;
    startDate: Date | null;
    endDate: Date | null;
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' 
    keyResult: KeyResultsType[] | null
}

export interface AppState {
    isSubmitting: boolean;
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
    goalData:Goal;
    setGoalData: React.Dispatch<React.SetStateAction<Goal>>;

    keyResultData:KeyResult;
    setKeyResultData: React.Dispatch<React.SetStateAction<KeyResult>>;
    metricValue:MetricValueType;
    setMetricValue: React.Dispatch<React.SetStateAction<MetricValueType>>;
    errors:{ [key: string]: string | null };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>;
    teamMembers: {label:string, value:string}[];
}

export interface GoalContextProp extends AppState {
  // Add other context properties or methods here if needed in the future
}

const GoalContext = createContext<GoalContextProp | undefined>(undefined);

const initialFormData: Goal = {
  goalName: '',
 
  // status: 'DRAFT',
};

const keyResult: KeyResult = {
    keyResultTitle: '',
    description: '',
    startDate: null,
    endDate: null,
    measurementType:'value',
    status: 'Not-started',
    keyResultOwner:null
    // status: 'DRAFT',
  };
  
const initialMetricValue:MetricValueType = {
  startValue:0,
  targetValue:0,
  unit:''
}

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {currentWorkSpace} = useUserStore()
    const [goalData, setGoalData] = useState<Goal>(initialFormData);
    const [keyResultData, setKeyResultData] = useState<KeyResult>(keyResult);
    const [metricValue, setMetricValue] = useState<MetricValueType>(initialMetricValue);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [teamMembers, setTeamMembers] = useState<{label:string, value:string}[]>([]);

    useEffect(() => {
      const fetchTeamMembers = async () => {
        if (!currentWorkSpace?.workspaceAlias) return;
  
        try {
          const response = await fetch(`/api/workspaces/team?workspaceId=${currentWorkSpace.workspaceAlias}`);
          const { data, error } = await response.json();
  
          if (error) {
            console.error("Error fetching team members:", error);
            setTeamMembers([]);
          } else {
            const teams = data.map((team: BookingTeamMember) => ({
              label: `${team?.userId?.firstName} ${team?.userId?.lastName}`,
              value: `${team?.id}`,
            }));
            setTeamMembers(teams || []);
          }
        } catch (err) {
          console.error("Unhandled error in fetching team members:", err);
        }
      };
  
      fetchTeamMembers();
    }, [currentWorkSpace]);

  const contextValue: GoalContextProp = {
    goalData, setGoalData,
    errors, setErrors,
    isSubmitting, setIsSubmitting,
    keyResultData, setKeyResultData,
    metricValue, setMetricValue, 
    teamMembers,
  };

  return (
    <GoalContext.Provider value={contextValue}>
      {children}
    </GoalContext.Provider>
  );
};
export const useGoalContext = (): GoalContextProp => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoalContext must be used within an AppProvider');
  }
  return context;
};
