"use client"

import { useGetBookingsAnalytics } from '@/hooks/services/appointments';
import useUserStore from '@/store/globalUserStore';
import { Booking } from '@/types/appointments';
 
import React, { createContext, useContext, ReactNode, } from 'react';

export interface AnalyticsContextProp {
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>
    isLoading:boolean,
    error:string | null,
    getBookings: (type:string)=>Promise<void>,
    current:Booking[],
    previous:Booking[],
    handleSetType:(type:string)=>void,
}

const AnalyticsContext = createContext<AnalyticsContextProp | undefined>(undefined);


export const AnalyticsProvider: React.FC<{
  curList: Booking[] | null;
  prevList: Booking[] | null; 
  typeParam:string, 
  children: ReactNode }> = ({typeParam, curList, prevList, children }) => {

    const {
      isLoading,
      error,
      getBookings,
      current,
      previous,
      type, setType,
      handleSetType,
    } = useGetBookingsAnalytics({typeParam, curList, prevList})
    
  const contextValue: AnalyticsContextProp = {
    type, setType,
    isLoading,
    error,
    getBookings,
    current,
    previous,
    handleSetType,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = (): AnalyticsContextProp => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AppProvider');
  }
  return context;
};
