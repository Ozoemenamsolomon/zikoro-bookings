"use client";

import { AppointmentLink, } from "@/types/appointments";
// import { getRequest } from "@/utils/api";
import { useState,   useCallback,  } from "react";
// import {toast} from "react-toastify";
// import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from 'date-fns';
import useUserStore from "@/store/globalUserStore";
import { createClient } from "@/utils/supabase/client";
// import { fetchAllData } from "@/lib/client";
import { settings } from "@/lib/settings";

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

// export const useGetBookings = () => {
//   const { user } = useUserStore();
//   // console.log({userF:user})

//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [isLoading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const getBookings = async (date: Date | string) => {
//     setLoading(true);
//     setError('')
//     try {
//       const response = await fetch(`/api/appointments?date=${date}&userId=${user?.id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         setError('Error fetching schedules!');
//         toast.error('Error fetching schedules!');
//         return;
//       }

//       const data = await response.json();
//       // console.log('Fetched Appointments:', data);

//       if (data?.error) {
//         setError('Error fetching schedules!');
//         toast.error('Error fetching schedules!');
//         return;
//       }

//       setBookings(data.data);
//       return data
//     } catch (error) {
//       // console.error('Error fetching schedules:', error);
//       setError('Error fetching schedules!');
//       toast.error('Error fetching schedules!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPastBookings = async () => {
//     setLoading(true);
//     setError('')
//     try {
//       const response = await fetch(`/api/appointments/old_appointments?userId=${user?.id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         setError('Error fetching schedules!');
//         toast.error('Error fetching schedules!');
//         return;
//       }

//       const data = await response.json();
//       // console.log('Fetched Appointments:', data);

//       if (data?.error) {
//         setError('Error fetching schedules!');
//         toast.error('Error fetching schedules!');
//         return;
//       }

//       setBookings(data.data);
//     } catch (error) {
//       // console.error('Error fetching schedules:', error);
//       setError('Error fetching schedules!');
//       toast.error('Error fetching schedules!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { bookings, isLoading, error, getBookings, getPastBookings };
// };


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
//   const [bookings, setBookings] = useState<AppointmentLink | null>(null);
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
//         setBookings(data.data);
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

// export const useGetBookingsAnalytics = () => {
//   const {user, setUser} = useUserStore()

//   const [isLoading, setLoading] = useState<boolean>(true);
//   const [type, setType] = useState<string>('weekly');
//   const [error, setError] = useState<string | null>(null);
//   const [current, setCurrent] = useState<Booking[]>([])
//   const [previous, setPrevious] = useState<Booking[]>([])

//   const formatDateRange = (currentStart: string, currentEnd: string, previousStart: string, previousEnd: string, user:UserType): string => 
//     `/appointments/booking/analytics?curStart=${currentStart}&curEnd=${currentEnd}&prevStart=${previousStart}&prevEnd=${previousEnd}&userId=${user?.id}`;

//     const getBookings = useCallback(async (user:UserType) => {
//       setLoading(true);
//       setError(null);
//       try {
//         let currentStart, currentEnd, previousStart, previousEnd;
    
//         if (type === 'weekly') {
//           currentStart = startOfWeek(new Date()).toISOString();
//           currentEnd = endOfWeek(new Date()).toISOString();
//           previousStart = startOfWeek(subWeeks(new Date(), 1)).toISOString();
//           previousEnd = endOfWeek(subWeeks(new Date(), 1)).toISOString();
//         } else if (type === 'monthly') {
//           currentStart = startOfMonth(new Date()).toISOString();
//           currentEnd = endOfMonth(new Date()).toISOString();
//           previousStart = startOfMonth(subMonths(new Date(), 1)).toISOString();
//           previousEnd = endOfMonth(subMonths(new Date(), 1)).toISOString();
//         } else if (type === 'yearly') {
//           currentStart = startOfYear(new Date()).toISOString();
//           currentEnd = endOfYear(new Date()).toISOString();
//           previousStart = startOfYear(subYears(new Date(), 1)).toISOString();
//           previousEnd = endOfYear(subYears(new Date(), 1)).toISOString();
//         } else {
//           throw new Error('Invalid type specified');
//         }
    
//         const { data, status } = await getRequest<{ cur: Booking[], prev: Booking[] }>({
//           endpoint: formatDateRange(currentStart, currentEnd, previousStart, previousEnd, user),
//         });

//         if (status === 200) {
//           setCurrent(data.cur || []);
//           setPrevious(data.prev || []);
//         } else {
//           setError('Error fetching data!');
//         }
    
//       } catch (err) {
//         console.log({err})
//         setError('Server error');
//       } finally {
//         setLoading(false);
//       }
//     }, [type]);

//     const getYearlyBooking = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         let currentStart = startOfYear(new Date()).toISOString();
//         let currentEnd = endOfYear(new Date()).toISOString();
//         let previousStart = startOfYear(subYears(new Date(), 1)).toISOString();
//         let previousEnd = endOfYear(subYears(new Date(), 1)).toISOString();
//         const { data, status } = await getRequest<{ cur: Booking[], prev: Booking[] }>({
//           endpoint: formatDateRange(currentStart, currentEnd, previousStart, previousEnd),
//         });
//         if (status === 200) {
//           setCurrent(data.cur || []);
//           setPrevious(data.prev || []);
//         } else {
//           setError('Error fetching data!');
//         }
//       } catch (err) {
//         console.log({err})
//         setError('Server error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     useEffect(() => {
//       if(user) {
//         getBookings(user)
//       };
//     }, [type,user]);

//   return {isLoading,error,getBookings,current,previous, type, setType, getYearlyBooking}
// }

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
