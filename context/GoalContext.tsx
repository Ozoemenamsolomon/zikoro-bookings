"use client"

import React, { createContext, useContext, useState, ReactNode, } from 'react';

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
    goalData:GoalFormData;
    setGoalData: React.Dispatch<React.SetStateAction<GoalFormData>>;
    keyResultData:KeyResultsType;
    setKeyResultData: React.Dispatch<React.SetStateAction<KeyResultsType>>;
    metricValue:MetricValueType;
    setMetricValue: React.Dispatch<React.SetStateAction<MetricValueType>>;
    errors:{ [key: string]: string | null };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>;
}

export interface GoalContextProp extends AppState {
  // Add other context properties or methods here if needed in the future
}

const GoalContext = createContext<GoalContextProp | undefined>(undefined);

const keyResult: KeyResultsType = {
    name: '',
    description: '',
    owner: '',
    startDate: null,
    endDate: null,
    metricType:'value',
    metric: [],
    status: 'DRAFT',
  };
  
  const initialFormData: GoalFormData = {
    name: '',
    description: '',
    owner: '',
    startDate: null,
    endDate: null,
    keyResult: [keyResult],
    status: 'DRAFT',
};

const initialMetricValue:MetricValueType = {
  startValue:0,
  targetValue:0,
  unit:''
}

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [goalData, setGoalData] = useState<GoalFormData>(initialFormData);
    const [keyResultData, setKeyResultData] = useState<KeyResultsType>(keyResult);
    const [metricValue, setMetricValue] = useState<MetricValueType>(initialMetricValue);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

  const contextValue: GoalContextProp = {
    goalData, setGoalData,
    errors, setErrors,
    isSubmitting, setIsSubmitting,
    keyResultData, setKeyResultData,
    metricValue, setMetricValue,
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