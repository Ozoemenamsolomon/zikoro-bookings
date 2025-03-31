"use client";

import { ChevronDown, Edit, RefreshCw, RotateCw, SquarePen, XCircle } from "lucide-react";
import React, { Dispatch, SetStateAction, Suspense, useRef, useState } from "react";
import { useGetBookings } from "@/hooks/services/appointments";
import { format, parseISO } from "date-fns";
import { Booking, BookingsQuery } from "@/types/appointments";
import { useEffect } from "react";
import { useClickOutside } from "@/lib/useClickOutside";
import Empty from "../calender/Empty";
import { Reschedule } from "./Reschedule";
import { GroupedBookings } from "@/lib/server/appointments";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { PopoverMenu } from "../../shared/PopoverMenu";
import Loading from "@/components/shared/Loader";
import EmptyList from "../ui/EmptyList";
import SearchAppointment from "./SearchAppointment";
import EditAppointment from "./EditAppointment";
import { NoAppointmentListsIcon, RotateClockIcon, urls } from "@/constants";
import PaginationMain from "@/components/shared/PaginationMain";
import Link from "next/link";

const BookingRow = ({
  booking,
  showNote, 
  setShowNote,
  setGroupedBookings
}: {
  booking: Booking;
  showNote: any;
  setShowNote: (any: any) => void;
  setGroupedBookings: Dispatch<SetStateAction<GroupedBookings | null>>
}) => {
  const {
    participantEmail,
    lastName,
    firstName,
    appointmentTimeStr,
    phone,
    appointmentDate,
    appointmentName,
    appointmentTime,
    notes,
    bookingStatus,
    appointmentType,
    id,
    checkIn,checkOut
  } = booking;
  const dateTimeString = `${appointmentDate}T${appointmentTime}`;
  const dateTime = new Date(dateTimeString);
  const notesRef = useRef(null);

  const { setBookingFormData, setSelectedItem } = useAppointmentContext();
  useClickOutside(notesRef, () => setShowNote(null));
  
  return (
    <>
    <tr className="bg-white border-b relative w-full flex">
      <td className="py-4 px-4 w-3/12  ">
        <div className="flex items-center">
          <div
            className="capitalize flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-2"
            style={{
              background:
                "linear-gradient(269.83deg, rgba(156, 0, 254, 0.12) 0.14%, rgba(0, 31, 203, 0.12) 99.85%)",
            }}
          >
            {(firstName + " " + lastName)
              .split(" ").slice(0,2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">
              {firstName} {lastName}
            </p>
            <p className="text-sm text-gray-500 truncate ">
              {participantEmail}
            </p>
          </div>
        </div>
      </td>
      <td className="py-2 px-4 w-2/12">{appointmentTimeStr}</td>
      <td className="py-2 px-4 w-3/12 flex-1 min-w-0 truncate">
        {appointmentName}
      </td>
      <td
        className={`py-2 px-4 w-2/12 truncate ${
          bookingStatus === "CANCELLED"
            ? "text-red-700"
            : bookingStatus === "RESCHEDULED"
            ? "text-green-700"
            : "text-zikoroBlue"
        }`}
      >
        {bookingStatus || "ACTIVE"}
      </td>
      <td className="py-2 px-4 relative w-2/12">
        <div className="flex space-x-2 ">
            <button
              onClick={() => {
                setBookingFormData({
                  ...booking,
                  type: "reschedule",
                  timeStr: booking?.appointmentTimeStr,
                });
                setSelectedItem(dateTime);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <RotateClockIcon size={22} />
            </button>
          <button
            disabled={bookingStatus === "CANCELLED"}
            onClick={() => {
              setBookingFormData({
                ...booking,
                type: "cancel",
                timeStr: booking?.appointmentTimeStr,
              });
              // setSelectedItem(dateTimeString)
            }}
            className="text-red-500 hover:text-red-700 disabled:text-slate-300"
          >
            <XCircle size={21} />
          </button>

           <EditAppointment booking={booking} setGroupedBookings={setGroupedBookings}/>
        </div>
      </td>
    </tr>

    {(checkIn || checkOut) && (
      <tr className="bg-gray-50 text-gray-700">
        <td colSpan={5} className="py-2 px-4 text-center text-sm flex gap-5 justify-center w-full">
          <span>{checkIn ? `Check-in: ${format(checkIn,'hh : mm a')}` : "Check-in: N/A"}</span>
          <span>{checkOut ? `Check-out: ${format(checkOut, 'hh : mm a')}` : "Check-out: N/A"}</span>
        </td>
      </tr>
    )}
  </>
  );
};

const BookingTable = ({
  date,
  bookings,
  setGroupedBookings
}: {
  date: string;
  bookings: Booking[];
  setGroupedBookings: Dispatch<SetStateAction<GroupedBookings | null>>

}) => {
  const formattedDate = format(parseISO(date), "EEEE, d MMMM, yyyy");
  const [showNote, setShowNote] = useState<any>(null);

  return (
    <section
      id={format(parseISO(date), "yyyy-MM-dd")}
      className="grid overflow-auto no-scrollbar shadow bg-white rounded-lg px-2 sm:px-6 py-8"
    >
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center max-sm:px-4 pb-4">
        <h5 className="font-semibold">{formattedDate} - </h5>
        <p className="text-purple-600">{bookings.length} appointment(s)</p>
      </div>

      <div className="w-full  text-xs sm:text-sm xl:text-base overflow-x-auto overflow-y-visible h-full hide-scrollbar">
        <table className="w-full bg-white  ">
          <thead>
            <tr className="bg-gray-50 text-gray-700 w-full flex">
              <th className="py-3 px-4 text-left text-sm font-medium w-3/12">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium w-2/12">
                Time
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium w-3/12">
                Appointment Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium w-2/12">
                Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium w-2/12"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                showNote={showNote}
                setShowNote={setShowNote}
                setGroupedBookings={setGroupedBookings}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const GroupedBookingSections = ({
  groupedBookings,
  setGroupedBookings
}: {
  groupedBookings: GroupedBookings;
  setGroupedBookings: Dispatch<SetStateAction<GroupedBookings | null>>
}) => (
  <div className="space-y-6 ">
    {Object.entries(groupedBookings).map(([date, bookings]) => (
      <BookingTable key={date} date={date} bookings={bookings} setGroupedBookings={setGroupedBookings} />
    ))}
  </div>
);

const Appointments = ({
  groupedBookingData,
  fetchedcount,
  fetchError,
  searchQuery,
}: {
  groupedBookingData: GroupedBookings | null;
  fetchError: string | null;
  fetchedcount: number;
  searchQuery: BookingsQuery;
}) => {
  const { getWsUrl, setDateRange} = useAppointmentContext() 
  
  const { groupedBookings,setGroupedBookings, count, error, isLoading, getBookings, filterBookings, setQueryParams, queryParams,currentPage,totalPages,handlePageChange, setCurrentPage} =
    useGetBookings({
      groupedBookingData,
      fetchedcount,
      fetchError,
      searchQuery,
    });
  //  console.log({groupedBookings, groupedBookingData, fetchedcount})
  const [drop, setDrop] = useState(false);
  const [filter, setFilter] = useState("upcoming");
  const dropRef = useRef(null);

  useClickOutside(dropRef, () => setDrop(false));

  const fetchBookings = () => {
    setDateRange(undefined)
    if (filter === "upcoming") {
      filterBookings({type:"upcoming-appointments"})
      // getBookings("upcoming-appointments");
    } else {
      filterBookings({type:"past-appointments"})
      // getBookings("past-appointments");
    }
  };

  useEffect(() => {
    if (searchQuery?.date) {
      const element = document.getElementById(searchQuery?.date);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [searchQuery?.date]);

  const refresh = () => {
    fetchBookings();
  };

  const selectView = (view: string) => {
    if (filter === view) return;
    setFilter(view);
    if (view === "upcoming") {
      filterBookings({type:"upcoming-appointments"})
    } else {
      filterBookings({type:"past-appointments"})
    }
  };

  if(!count){
    return <EmptyList
    icon={<NoAppointmentListsIcon/>}
    heading='No Appointments Yet!'
    text='Your upcoming appointments will appear here once clients start booking with you.'
    CTA={<Link href={getWsUrl(urls.schedule)} className='py-3 px-6 font-semibold text-white rounded-md bg-basePrimary' >Share Your Booking Link</Link>}
    className='lg:h-[40em] '
  />
  }

  return (
    <>
      <Suspense>
        <Reschedule
          refresh={refresh}
          getBookings={getBookings}
          setFilter={setFilter}
        />
      </Suspense>

      <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
        <div>
          <h4 className="text-2xl font-semibold">Appointments</h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="">
            <button
              onClick={refresh}
              className="p-2 border border-slate-300 bg-white rounded-full text-zikoroBlue hover:shadow duration-200"
            >
              <RotateCw  size={20} />
            </button>
          </div>

          <div ref={dropRef} className=" w-[15.5rem]">
            <div className=" relative rounded-full w-[15.5rem] bg-basePrimary p-0.5">
              <button
                onClick={() => setDrop((curr) => !curr)}
                className="py-2 w-full bg-white px-4 rounded-full flex justify-between gap-2 items-center text-sm"
              >
                <p>
                  {filter === "upcoming"
                    ? "Upcoming appointments"
                    : "Past appointments"}
                </p>
                <ChevronDown
                  size={18}
                  className={`${
                    drop ? "rotate-180" : " rotate-0 "
                  } transform transition-all duration-300 ease-linear`}
                />
              </button>

              <div
                className={`${
                  drop ? "max-h-screen" : "max-h-0 "
                } transform transition-all duration-300 ease-linear absolute right-0 w-full mt-1 bg-white rounded-md shadow-lg z-10 overflow-hidden`}
              >
                <ul className="py-1">
                  <li
                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer ${
                      filter === "upcoming" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setDrop(false);
                      selectView("upcoming");
                    }}
                  >
                    Upcoming appointments
                  </li>
                  <li
                    className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer ${
                      filter === "past" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setDrop(false);
                      selectView("past");
                    }}
                  >
                    Past appointments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchAppointment filterBookings={filterBookings} queryParams={queryParams} filter={filter} setQueryParams={setQueryParams} setCurrentPage={setCurrentPage}/>

      <Suspense
        fallback={
          <div className="h-screen w-full flex justify-center items-center">
            <Loading size={40} />
          </div>
        }
      >
        {
          isLoading ? (
          <div className="h-60 w-full flex justify-center items-center">
            <Loading size={40} />
          </div>
        ) : error ? (
          <section className="py-20 text-center w-full">{error}</section>
        ) : !count ? (
          <Empty
            placeholder="/appointments-placeholder.PNG"
            text={`You don't have any booked appointment.`}
          />
        ) : groupedBookings && !Object.keys(groupedBookings!)?.length ? (
          <EmptyList className=" " 
            text={getEmptyListMessage(queryParams)} 
            />
        ) : (
          groupedBookings && (
            <>
            <GroupedBookingSections groupedBookings={groupedBookings} setGroupedBookings={setGroupedBookings} />
            <PaginationMain currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )
        )}
      </Suspense>
    </>
  );
};

export default Appointments;


const getEmptyListMessage = (searchParams: BookingsQuery) => {
  const { search, status, type, date, from, to, appointmentName, teamMember } = searchParams;
  
  if (search) return "🔍 No results found for your search.";
  if (status) return `🚦 No bookings found for "${status}".`;
  if (type==='upcoming-appointments') return "📅 No upcoming appointments found.";
  if (type==='past-appointments') return "📅 No past appointments found.";
  if (date) return `📆 No bookings available for this date. \n ${format(new Date(date),'dd MMMM yyyy')}`;
  if (from&&to) return `🗓️ No appointments scheduled between \n${format(new Date(from), 'dd MMMM yyyy')} and ${format(new Date(to), 'dd MMMM yyyy')}.`;
  if (appointmentName) return `🔖 No appointments match the name, ${appointmentName}.`;
  if (teamMember) return `👥 No bookings found for this team member, ${teamMember}.`;

  return "📄 No appointments available.";
};
