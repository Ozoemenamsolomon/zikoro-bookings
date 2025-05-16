"use client";

import { AppointmentLink, AppointmentUnavailability, Booking, BookingNote, BookingNoteInput, BookingReminder, BookingsContact, BookingsQuery, } from "@/types/appointments";
import { useState,   useCallback,  } from "react";
import useUserStore from "@/store/globalUserStore";

import { settings } from "@/lib/settings";
import { toast } from "react-toastify";
import { GroupedBookings } from "@/lib/server/appointments";
import { getRequest, PostRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { deleteItem } from "@/lib";

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
        const  response = await fetch(`/api/schedules?userId=${user?.id}&start=${offset}&end=${offset + limit - 1}&workspaceId=${currentWorkSpace?.organizationAlias}`);
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
      const  response = await fetch(`/api/appointments?type=${type}&userId=${user?.id}&date=${date}&workspaceId=${currentWorkSpace?.organizationAlias}`);
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
      if (currentWorkSpace?.organizationAlias) apiQueryParams.append('workspaceId', currentWorkSpace.organizationAlias);
      if (params.search) apiQueryParams.append('search', params.search);
      if (params.status) apiQueryParams.append('status', params.status);
      if (params.page) apiQueryParams.append('page', String(params.page));
      if (params.type) apiQueryParams.append('type', params.type);
      if (params.date) apiQueryParams.append('date', params.date);
      if (params.from) apiQueryParams.append('from', params.from);
      if (params.to) apiQueryParams.append('to', params.to);
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
  
  const handlePageChange = (page:number) => {
    setCurrentPage(page)
    filterBookings({...queryParams, page})
  }

  return { groupedBookings,setGroupedBookings, currentPage,totalPages,handlePageChange, isLoading, error: errorMessage, count, getBookings, filterBookings,queryParams, setQueryParams, setCurrentPage };
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
      const response = await fetch(`/api/analytics/?type=${fetchType}&userId=${user?.id}&workspaceId=${currentWorkSpace?.organizationAlias}`);
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
      const response = await fetch(`/api/calendar?date=${date}&viewing=${viewingType}&userId=${user?.id}&workspaceId=${currentWorkSpace?.organizationAlias}`);
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
      const response = await fetch(`/api/bookingsContact?workspaceId=${currentWorkSpace?.organizationAlias}`)
       const {data,error,count} = await response.json()
       return {data,error,count} 
    }

  return { insertBookingsContact,fetchAllContacts };
}


export function useBookingsReminder() {
  const {currentWorkSpace, user } = useUserStore()

  const insertBookingsReminder = useCallback(async (booking: Booking) => {
    const { data, error } = await PostRequest({
      url: `/api/bookingReminders/create`,
      body: booking
    })  
    if (data) return 'Reminder added successfully'
    return '';
    }, []);

    const fetchAllBookingReminders= async () => {
      const response = await fetch(`/api/bookingReminders?workspaceId=${currentWorkSpace?.organizationAlias}&owner=${user?.id}`)
       const {data,error,count} = await response.json()
       return {data,error,count} 
    }

  return { insertBookingsReminder, fetchAllBookingReminders };
}

 
type UseBookingNotesProps = {
  notes: BookingNote[] | null;
  tableSize: number | null;
  err: string | null;
  contactId: string;
};

export function useBookingsNotes({ notes, tableSize, err, contactId }: UseBookingNotesProps) {
  const { currentWorkSpace, user } = useUserStore();
  const [contactNotes, setContactNotes] = useState<BookingNote[]>(notes ?? []);
  const [error, setError] = useState<string | null>(err);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil((tableSize ?? 0) / 20) || 1
  );

  const insertNote = useCallback(async (note: BookingNoteInput): Promise<string> => {
    console.log({note})
    const { data, error } = await PostRequest({
      url: `/api/appointments/addNote`,
      body: note,
    });

    if (data) {
      setContactNotes(prev => [data, ...prev]);
      toast.success('Note added successfully')
      return 'Note added successfully';
    }
    toast.error('Failed to add note')
    return  '';
  }, []);

  const updateNote = useCallback(async (note: BookingNoteInput): Promise<string> => {
    const { data, error } = await PostRequest({
      url: `/api/appointments/editNote`,
      body: note,
    });

    if (data) {
      setContactNotes(prev =>
        prev.map(item => (item.id === data.id ? data : item))
      );
      toast.success('Note updated successfully')
      return 'Note updated successfully';
    }
    toast.error('Failed to update note')
    return  '';
  }, []);

  const deleteNote = useCallback(async (id: number)  => {
    const { error } = await deleteItem('bookingNote', String(id))
    if (!error) {
      setContactNotes(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const fetchContactNotes = useCallback(
    async (contactId: string, page = 1) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/contacts/notes?workspaceId=${currentWorkSpace?.organizationAlias}&owner=${user?.id}&contactId=${contactId}&page=${page}`
        );
        const { data, error, count } = await res.json();

        setContactNotes(data ?? []);
        setError(error ?? null);
        setTotalPages(Math.ceil((count ?? 0) / 20) || 1);

        return { data, error, count };
      } catch (err) {
        setError('Unhandled error: check your network and try again');
        return { data: null, error: 'Unhandled error', count: null };
      } finally {
        setLoading(false);
      }
    },
    [currentWorkSpace?.organizationAlias, user?.id]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      await fetchContactNotes(contactId, page);
    },
    [contactId, fetchContactNotes]
  );

  return {
    insertNote,
    updateNote,
    deleteNote,
    fetchContactNotes,
    handlePageChange,
    currentPage,
    loading,
    error,
    contactNotes,
    totalPages,
  };
}
