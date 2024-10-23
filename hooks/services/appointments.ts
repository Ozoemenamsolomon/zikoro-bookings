"use client";

import { AppointmentLink, AppointmentUnavailability, Booking, } from "@/types/appointments";
import { useState,   useCallback, useEffect,  } from "react";
import useUserStore from "@/store/globalUserStore";
import { createClient } from "@/utils/supabase/client";
import { settings } from "@/lib/settings";
import { toast } from "react-toastify";
import { GroupedBookings } from "@/lib/server/appointments";
import { getRequest } from "@/utils/api";
import { fetchCalendarData } from "@/lib/server/calendar";
import { format } from "date-fns";

const supabase = createClient();

export const useGetSchedules =  (scheduleData?: { error?: string | null; schedules?: AppointmentLink[] | null; count?: number } )=> {
  const { user } = useUserStore();
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

        const { data, count: newCount, error: fetchError } = await supabase
          .from('appointmentLinks')
          .select('*', { count: 'exact' })
          .eq('createdBy', user?.id)
          .range(offset, offset + limit - 1)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching appointments:', fetchError);
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
}: {
  groupedBookingData: GroupedBookings | null;
  fetchedcount: number;
  fetchError: string | null;
}) => {
  const { user } = useUserStore(); 
  const [groupedBookings, setGroupedBookings] = useState<GroupedBookings | null>(groupedBookingData);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(fetchedcount);
  const [errorMessage, setError] = useState<string | null>(fetchError);

  const getBookings = async (type: string = '') => {
    setLoading(true);
    setError(null);  
  
    try {
      const  response= await fetch(`/appointments?type=${type}&userId=${user?.id}`);
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
  

  return { groupedBookings, isLoading, error: errorMessage, count, getBookings };
};


// export const getAppointment = async (appointmentAlias:string) => {
//   const { data, status } = await getRequest<AppointmentLink>({
//     endpoint: `/appointments/booking/${appointmentAlias}`,
//   });
//   return  data.data;
// };

// export const getBookings = async (bookingStatus?:string ) => {
//   const { data, status } = await getRequest<Booking>({
//     endpoint: `/appointments/booking?bookingStatus=${bookingStatus}`,
//   });
//   return  data.data;
// };

// export const useGetBookingAppointment = (appointmentAlias: string) => {
//   const [appointment, setAppointment] = useState<AppointmentLink | null>(null);
//   const [isLoading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const getAppointment = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, status } = await getRequest<AppointmentLink>({
//         endpoint: `/appointments/booking/${appointmentAlias}`,
//       });

//       if (status === 200) {
//         setAppointment(data.data);
//       } else {
//         setError(`Error fetching data! Check Your network`);
//       }
//     } catch (err) {
//       setError(`Error fetching data! Check Your network`);
//     } finally {
//       setLoading(false);
//     }
//   }, [appointmentAlias]);

//   useEffect(() => {
//     if (appointmentAlias) {
//       getAppointment();
//     }
//   }, [appointmentAlias, getAppointment]);

//   return { appointment, isLoading, error, getAppointment };
// };

// export const useGetBookingList = (appointmentAlias: string) => {
//   const [bookings, setGroupedBookings] = useState<AppointmentLink | null>(null);
//   const [isLoading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const getAppointment = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, status } = await getRequest<AppointmentLink>({
//         endpoint: `/appointments/booking/list/${appointmentAlias}`,
//       });

//       if (status === 200) {
//         setGroupedBookings(data.data);
//       } else {
//         setError(`Error: ${status}`);
//       }
//     } catch (err) {
//       setError('server error');
//     } finally {
//       setLoading(false);
//     }
//   }, [appointmentAlias]);

//   useEffect(() => {
//     if (appointmentAlias) {
//       getAppointment();
//     }
//   }, [appointmentAlias, getAppointment]);

//   return { bookings, isLoading, error, getAppointment };
// };

// export const useGetUnavailableDates = (userId: bigint,) => {
//   const [unavailableDates, setUnavailableDates] = useState<AppointmentUnavailability[] | null>(null);
//   const [isLoading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const getUnavailableDates = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, status } = await getRequest<AppointmentUnavailability[] | null>({
//         endpoint: `/appointments/calender/fetchUnavailability?userId=${userId}`,
//       });

//       if (status === 200) {
//         setUnavailableDates(data.data);
//       } else {
//         console.log({error})
//         setError(`Error: ${error}`);
//       }
//     } catch (err) {
//       setError('Server error');
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (userId) {
//       getUnavailableDates();
//     }
//   }, [userId, getUnavailableDates]);

//   return { unavailableDates,setUnavailableDates, isLoading, error, getUnavailableDates };
// };

export const useGetBookingsAnalytics = ({
  curList, 
  prevList, 
  typeParam
}: {
  curList: Booking[] | null;
  prevList: Booking[] | null;
  typeParam?: string;
}) => {
  const { user } = useUserStore();

  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState(typeParam || 'weekly');
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState<Booking[]>(curList ?? []);
  const [previous, setPrevious] = useState<Booking[]>(prevList ?? []);

  const getBookings = useCallback(async (fetchType = type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/analytics/?type=${fetchType}&userId=${user?.id}`);
      if ( !response.ok) {
        throw new Error('Error fetching appointments');
      }
      
      if (response.status===200) {
        const { data } = await response.json()
        setCurrent(data?.cur || []);
        setPrevious(data?.prev || []);
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
    await getBookings(typeToSet);
  }, [type, getBookings]);

  return {
    isLoading,
    error,
    getBookings,
    current,
    previous,
    type,
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

export const useCalendarData = ({viewing, date, count, formattedWeekData,formattedMonthData, startRangeDate, endRangeDate, errorMsg}: Params) => {
  const {user} = useUserStore()
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
      const response = await fetch(`/api/calendar?date=${date}&viewing=${viewingType}&userId=${user?.id}`);
      if (!response.ok) {
        // console.log(`Error fetching calendar data: ${response.statusText}`);
        throw new Error(`Error fetching calendar data: ${response.statusText}`);
      }
      const { count, data, startRangeDate, endRangeDate, date: fetchedDate } = await response.json();
      console.log({ count, data, startRangeDate, endRangeDate, date: fetchedDate });
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

// export function useBookingsContact() {
//   const insertBookingsContact = useCallback(async (contact: BookingsContact) => {
//     const supabase = createClient()

//     const { data, error } = await supabase
//       .from('bookingsContact')
//       .insert([contact])
//       .select('*')
//       .single();

//     if (error) { 
//       console.error('Error inserting data:', error);
//       return null;
//     }

//     console.log('Data inserted successfully:',contact, data );
//     // return data;
//   }, []);

//   return { insertBookingsContact };
// }
