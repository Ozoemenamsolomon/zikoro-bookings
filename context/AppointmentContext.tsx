"use client"

import { Booking, BookingsContact, UserType } from '@/types/appointments';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useUserStore from "@/store/globalUserStore";
import { wsUrl, wsUrll } from '@/lib/wsUrl';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { fetchOneTeamMember, fetchTeamMembers } from '@/lib/server/workspace';

export interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isfetching: boolean;
  setIsFetching: (loading: boolean) => void;
  isFormUp: string;
  setIsFormUp: (formType: string) => void;
  bookingFormData: Booking|null; 
  setBookingFormData: React.Dispatch<React.SetStateAction<Booking|null>>;
  selectedType: string; 
  setselectedType: React.Dispatch<React.SetStateAction<string>>;
  inactiveSlots: string[]; 
  setInactiveSlots: React.Dispatch<React.SetStateAction<string[]>>;
  slotCounts: { [key: string]: number } |null; 
  setSlotCounts: React.Dispatch<React.SetStateAction<{ [key: string]: number }|null>>;
  // user: UserType | null; 
  // setUser: React.Dispatch<React.SetStateAction<UserType|null>>;
  selectedItem: any; 
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
  contact: BookingsContact | null, 
  setContact:React.Dispatch<React.SetStateAction<BookingsContact | null >>;
  contacts: BookingsContact[] | null, 
  setContacts:React.Dispatch<React.SetStateAction<BookingsContact[] | null >>;
  show: string, 
  setShow:React.Dispatch<React.SetStateAction<string>>;
  teamMembers: {label:string,value:string}[], 
  setTeamMembers:React.Dispatch<React.SetStateAction<{label:string,value:string}[]>>;
  searchTerm: string, 
  setSearchTerm:React.Dispatch<React.SetStateAction<string>>;
  activePath: string, 
  setActivePath:React.Dispatch<React.SetStateAction<string>>;
  dateRange: DateRange|undefined, 
  setDateRange:React.Dispatch<React.SetStateAction<DateRange|undefined>>;
  isOpen:boolean, setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
  getWsUrl: (path:string) => string
}

export interface AppointmentContextProps extends AppState {
  // Add other context properties or methods here if needed in the future
}

const AppointmentContext = createContext<AppointmentContextProps | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isfetching, setIsFetching] = useState<boolean>(true);
  const [isFormUp, setIsFormUp] = useState<string>('');
  // const [user, setUser] = useState<UserType|null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activePath, setActivePath] = useState<string>('');

  const [bookingFormData, setBookingFormData] = useState<Booking|null>(null)
  const [inactiveSlots, setInactiveSlots] = useState<string[]>([]);
  const [selectedType, setselectedType] = useState<string>('single');
  const [slotCounts, setSlotCounts] = useState<{ [key: string]: number }|null>(null);
  const [selectedItem, setSelectedItem] = useState<any>();
  const [teamMembers, setTeamMembers] = useState<{label:string,value:string}[]>([]);
  
  const [contact, setContact] = useState<BookingsContact | null>(null);
  const [contacts, setContacts] = useState<BookingsContact[] | null>(null);
  const [show, setShow] = useState<string>('links')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<DateRange|undefined>()

  const { currentWorkSpace, user, setUser } = useUserStore();
  const workspaceParam = currentWorkSpace?.organizationAlias ? `${currentWorkSpace.organizationAlias}` : '';
  
  const getWsUrl = (path: string) =>  wsUrll(path,workspaceParam);
  
  // const{push}=useRouter()
  // useEffect(() => {
  //   if(!user?.referralCode) push(
  //           `/onboarding?email=${user?.userEmail}&createdAt=${user?.created_at}`
  //         )
  // }, [user])

  const contextValue: AppointmentContextProps = {
    isLoading,setLoading,isfetching, setIsFetching,
    isFormUp,setIsFormUp,
    bookingFormData, setBookingFormData,
    inactiveSlots, setInactiveSlots,
    slotCounts, setSlotCounts,
    // user, setUser,
    selectedType, setselectedType,
    selectedItem, setSelectedItem,
    contact, setContact, contacts, setContacts, show, setShow,
    searchTerm, setSearchTerm,activePath, setActivePath,
    isOpen, setIsOpen,
    getWsUrl,
    teamMembers, setTeamMembers,
    dateRange, setDateRange,
  };

  return (
    <AppointmentContext.Provider value={contextValue}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointmentContext = (): AppointmentContextProps => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within an AppProvider');
  }
  return context;
};
