"use client";

import { AppointmentLink, AppointmentUnavailability, Booking, BookingsContact, BookingsQuery, } from "@/types/appointments";
import { useState,   useCallback,  } from "react";
import useUserStore from "@/store/globalUserStore";

import { settings } from "@/lib/settings";
import { toast } from "react-toastify";
import { GroupedBookings } from "@/lib/server/appointments";
import { getRequest, PostRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAppointmentContext } from "@/context/AppointmentContext";

export const useGetSchedules =  (scheduleData?: { error?: string | null; schedules?: AppointmentLink[] | null; count?: number; } )=> {
  const { user, currentWorkSpace } = useUserStore();
  const [isError, setIsError] = useState<string>(scheduleData?.error||'');
  const [scheduleList, setScheduleList] = useState<AppointmentLink[]>(scheduleData?.schedules || []);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const limit = settings.schedulesLimit || 20
  const [totalPages, setTotalPages] = useState<number>(Math.ceil((scheduleData?.count || 0) / limit))
  
  const fetchSchedules = useCallback(
    async (page: number = 1) => {
      if(!user) return
      try {
        setIsError('');
        setLoading(true);

        const offset = (page - 1) * limit;
        const  response = await fetch(`/api/schedules?userId=${user?.id}&start=${offset}&end=${offset + limit - 1}&workspaceId=${currentWorkSpace?.workspaceAlias}`);
        if (response.status!==200) {
          throw new Error('Error fetching appointments');
        }
        const { data, error:fetchError, count:newCount} = await response.json()

        if (fetchError) {
          setIsError('Failed to fetch appointments. Please try again later.');
          return;
        }

        setScheduleList(data || []);
        setTotalPages(Math.ceil((newCount || 0) / limit))
        setCurrentPage(page);
        setIsError('');
      } catch (serverError) {
        console.error('Server error:', serverError);
        setIsError('Server error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [user?.id, limit]  
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchSchedules(page);
    }, [fetchSchedules]);

  return { fetchSchedules, handlePageChange,totalPages,loading,currentPage,scheduleList,isError };
};

export const useGetBookings = ({
  groupedBookingData,
  fetchedcount,
  fetchError,
  searchQuery,
}: {
  groupedBookingData: GroupedBookings | null;
  fetchedcount: number;
  fetchError: string | null;
  searchQuery: BookingsQuery;
}) => {
  const { user,currentWorkSpace } = useUserStore(); 
  const {getWsUrl} = useAppointmentContext()

  const [groupedBookings, setGroupedBookings] = useState<GroupedBookings | null>(groupedBookingData);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(fetchedcount);
  const [errorMessage, setError] = useState<string | null>(fetchError);
  const [queryParams, setQueryParams] = useState<BookingsQuery>(searchQuery);

  const [totalPages, setTotalPages] = useState(Math.ceil((fetchedcount || 0) / settings.countLimit));
  const [currentPage, setCurrentPage] = useState( 
    searchQuery?.page || 1);

  const {replace} = useRouter()

  const getBookings = async (type: string = '', date:string='') => {
    setLoading(true);
    setError(null);  
  
    try {
      const  response = await fetch(`/api/appointments?type=${type}&userId=${user?.id}&date=${date}&workspaceId=${currentWorkSpace?.workspaceAlias}`);
      if (response.status!==200) {
        throw new Error('Error fetching appointments');
      }
      const { data, error, count} = await response.json()
  
      if ( error) {
        throw new Error('Error fetching appointments');
      }
  
      // console.log({ data, error, count });
  
      setGroupedBookings(data);
      setCount(count);
  
      
      return data;
      
    } catch (err) {
      setError('Error fetching data! Try again');
      toast.error('Error fetching data! Try again');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = async (params: BookingsQuery) => {
    try {
      setError('');
      setLoading(true);
      setQueryParams(params)
  
      // Query parameters for the API request (includes userId & workspaceId)
      const apiQueryParams = new URLSearchParams();
  
      if (user?.id) apiQueryParams.append('userId', String(user.id));
      if (currentWorkSpace?.workspaceAlias) apiQueryParams.append('workspaceId', currentWorkSpace.workspaceAlias);
      if (params.search) apiQueryParams.append('search', params.search);
      if (params.status) apiQueryParams.append('status', params.status);
      if (params.page) apiQueryParams.append('page', String(params.page));
      if (params.type) apiQueryParams.append('type', params.type);
      if (params.date) apiQueryParams.append('date', params.date);
      if (params.appointmentDate) apiQueryParams.append('appointmentDate', params.appointmentDate);
      if (params.appointmentName) apiQueryParams.append('appointmentName', params.appointmentName);
      if (params.teamMember) apiQueryParams.append('teamMember', params.teamMember);
  
      // Fetch data from API
      const response = await fetch(`/api/appointments?${apiQueryParams.toString()}`);
  
      if (response.status !== 200) {
        console.error(await response.json());
        setError('Error fetching appointments');
      }
  
      const { data, error, count } = await response.json();
  // console.log( { data, error, count , params })
      setGroupedBookings(data);
      setCount(count);
      setTotalPages(Math.ceil((count || 0) / settings.countLimit));
      setError(error);
  
      // Query parameters for the browser URL (EXCLUDES userId & workspaceId)
      const urlQueryParams = new URLSearchParams(apiQueryParams);
  
      urlQueryParams.delete('userId');
      urlQueryParams.delete('workspaceId');
  
      // Update browser URL without userId & workspaceId
      replace(`${getWsUrl('/appointments')}?${urlQueryParams.toString()}`, { scroll: false });
  
      return data;
    } catch (err) {
      console.log(err);
      setError('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };
  

  return { groupedBookings,setGroupedBookings, isLoading, error: errorMessage, count, getBookings, filterBookings,queryParams, setQueryParams };
};

export const useGetBookingsAnalytics = ({
  curList, 
  prevList, 
  typeParam
}: {
  curList: Booking[] | null;
  prevList: Booking[] | null;
  typeParam?: string;
}) => {
  const { user,currentWorkSpace } = useUserStore(); 
  const {replace} = useRouter()

  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState(typeParam || 'weekly');
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Booking[]>(curList ?? []);
  const [previous, setPrevious] = useState<Booking[]>(prevList ?? []);

  const getBookings = useCallback(async (fetchType = type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics/?type=${fetchType}&userId=${user?.id}&workspaceId=${currentWorkSpace?.workspaceAlias}`);
      if ( !response.ok) {
        throw new Error('Error fetching appointments');
      }
      // console.log({res: await response.json()})
      if (response.status===200) {
        const { cur,prev } = await response.json()
        setCurrent(cur || []);
        setPrevious(prev || []);
      } else {
        setError('Error fetching data!');
      }
    } catch (err) {
      console.error(err);
      setError('Server error occurred while fetching bookings.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, type]);

  const handleSetType = useCallback(async (typeToSet: string) => {
    if (type === typeToSet) return;
    setType(typeToSet);
    await Promise.all([getBookings(typeToSet), replace(`?type=${typeToSet}`, {scroll:false, })])
  }, [type, getBookings]);

  return {
    isLoading,
    error,
    getBookings,
    current,
    previous,
    type, setType,
    handleSetType
  };
};

export const useGetUnavailableDates = (dayString:string, fecthedUnavailableDates?:AppointmentUnavailability[]) => { 
  const {user} = useUserStore()
  const [unavailableDates, setUnavailableDates] = useState<any>(fecthedUnavailableDates||[]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [slotList, setSlotList] = useState<{ from: string, to: string, id: bigint|number }[]>([]);

  const getUnavailableDates = useCallback(async (dayString?:string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await getRequest<any>({
        endpoint: `/calendar/fetchUnavailability?userId=${user?.id}`,
      });

      if (status === 200) {
        setUnavailableDates(data.data);
// console.log({dayString, data:data.data,})
      } else {
        console.log({error})
        setError(`Error: ${error}`);
      }
      return {data, error} 
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, dayString]);



  return { unavailableDates,setUnavailableDates, isLoading, error, getUnavailableDates, slotList, setSlotList };
};

interface CalendarDataState {
  formattedWeekData:  Record<string, Record<number, Booking[]>>|null,
  formattedMonthData: Record<string, Booking[]> | null;
  startRangeDate: Date | null;
  endRangeDate: Date | null;
  count: number;
}
interface Params {
  viewing: 'month' | 'week';
  date: Date;
  count: number;
  formattedWeekData:  Record<string, Record<number, Booking[]>>|null,
  formattedMonthData: Record<string, Booking[]> | null;
  startRangeDate: Date;
  endRangeDate: Date;
  errorMsg: string | null;
}

export const useCalendarData = ({viewing, date, count, formattedWeekData,formattedMonthData, startRangeDate, endRangeDate, errorMsg,}: Params) => {
  const {user,currentWorkSpace} = useUserStore()
  const [view, setView] = useState<'month' | 'week'>(viewing);
  const [currentDate, setCurrentDate] = useState<Date>(date);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(errorMsg);
  const [calendarData, setCalendarData] = useState<CalendarDataState>({
    formattedWeekData,formattedMonthData,
    startRangeDate: startRangeDate,
    endRangeDate: endRangeDate,
    count: count,
  });

  const getCalendarData = async (viewingType: "month" | "week" = viewing, date: Date = currentDate) => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/calendar?date=${date}&viewing=${viewingType}&userId=${user?.id}&workspaceId=${currentWorkSpace?.workspaceAlias}`);
      if (!response.ok) {
        // console.log(`Error fetching calendar data: ${response.statusText}`);
        throw new Error(`Error fetching calendar data: ${response.statusText}`);
      }
      const { count, data, startRangeDate, endRangeDate, date: fetchedDate } = await response.json();
      // console.log({ count, data, startRangeDate, endRangeDate, date: fetchedDate });
      setCalendarData({
        formattedWeekData,formattedMonthData,
        startRangeDate,
        endRangeDate,
        count,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching calendar data. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    calendarData,
    currentDate,setCurrentDate,
    loading,
    error,
    getCalendarData,
    view,setView,setError,
  };
};

export function useBookingsContact() {
  const {currentWorkSpace } = useUserStore()

  const insertBookingsContact = useCallback(async (contact: BookingsContact) => {
    const { data, error } = await PostRequest({
      url: `/api/bookingsContact/`,
      body: contact
    })  
 
    return data;
    }, []);

    const fetchAllContacts = async () => {
      const response = await fetch(`/api/bookingsContact?workspaceId=${currentWorkSpace?.workspaceAlias}`)
       const {data,error,count} = await response.json()
       return {data,error,count} 
    }

  return { insertBookingsContact,fetchAllContacts };
}
