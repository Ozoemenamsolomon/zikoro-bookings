"use client";

import { ChevronDown, RefreshCw, XCircle } from "lucide-react";
import React, { Suspense, useRef, useState } from "react";
import { useGetBookings } from "@/hooks/services/appointments";
import { format, parseISO } from "date-fns";
import { AppointmentLink, Booking } from "@/types/appointments";
// import PageLoading from "../ui/Loading";
import { useEffect } from "react";
import { useClickOutside } from "@/lib/useClickOutside";
// import { TimeDetail } from "../booking/Calender";

// import Empty from "../calender/Empty";
import useUserStore from "@/store/globalUserStore";
// import { Reschedule } from "./Reschedule";
import { GroupedBookings } from "@/lib/server/appointments";
import { useAppointmentContext } from "@/context/AppointmentContext";

// export function getEnabledTimeDetails(
//   appointmnetLink: AppointmentLink
// ): TimeDetail[] {
//   if (!appointmnetLink || !appointmnetLink.timeDetails) {
//     return [];
//   }
//   try {
//     const timeDetails: TimeDetail[] = JSON.parse(appointmnetLink.timeDetails);
//     return timeDetails.filter((item) => item.enabled);
//   } catch (error) {
//     // console.error("Failed to parse timeDetails:", error);
//     return [];
//   }
// }

const BookingRow = ({ booking, showNote, setShowNote }: { booking: Booking, showNote:any, setShowNote: (any:any)=>void }) => {
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
  } = booking;
  const dateTimeString = `${appointmentDate}T${appointmentTime}`;
  const dateTime = new Date(dateTimeString);
  const notesRef = useRef(null)

  const handleNotesClick = () => {
    if (showNote === id) {
      setShowNote(null);
    } else {
      setShowNote(id);
    }
  };

  const { setBookingFormData, setSelectedItem } = useAppointmentContext();
  useClickOutside(notesRef, ()=>setShowNote(null))
  
  return (
    <tr className="bg-white border-b relative">
    <td className="py-4 px-4 ">
      <div className="flex items-center">
        <div
          className="capitalize flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-2"
          style={{
            background:
              "linear-gradient(269.83deg, rgba(156, 0, 254, 0.12) 0.14%, rgba(0, 31, 203, 0.12) 99.85%)",
          }}
        >
          {(firstName + " " + lastName)
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {firstName} {lastName}
          </p>
          <p className="text-sm text-gray-500">{participantEmail}</p>
        </div>
      </div>
    </td>
    <td className="py-2 px-4">{appointmentTimeStr}</td>
    <td className="py-2 px-4">{appointmentName}</td>
    <td ref={notesRef} className="py-2 px-4 ">
      <button onClick={handleNotesClick} className=" relative cursor-pointer w-full flex justify-start">
        {notes ? <p>...</p> : null}
        {showNote === id && (
          <div className="absolute z-50 w-44 transform transition-all p-6 -left-10 rounded-lg shadow-md bg-white">
            {notes}
          </div>
        )}
      </button>
    </td>
    <td
      className={`py-2 px-4 ${
        bookingStatus === "CANCELLED"
          ? "text-red-700"
          : bookingStatus === "RESCHEDULED"
          ? "text-green-700"
          : "text-zikoroBlue"
      }`}
    >
      {bookingStatus || "ACTIVE"}
    </td>
    <td className="py-2 px-4 relative">
      <div className="flex space-x-2">
        <button
          onClick={() =>{
            setBookingFormData({
              ...booking,
              type: "reschedule",
              timeStr: booking?.appointmentTimeStr,
            })
            setSelectedItem(dateTime)
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          <RefreshCw size={18} />
        </button>
        <button
          disabled={bookingStatus === "CANCELLED"}
          onClick={() =>{
            setBookingFormData({
              ...booking,
              type: "cancel",
              timeStr: booking?.appointmentTimeStr,
            })
            // setSelectedItem(dateTimeString)
          }
          }
          className="text-red-500 hover:text-red-700 disabled:text-slate-300"
        >
          <XCircle size={18} />
        </button>
      </div>
    </td>
  </tr>
);
};

const BookingTable = ({
  date,
  bookings,
}: {
  date: string;
  bookings: Booking[];
}) => {
  const formattedDate = format(parseISO(date), "EEEE, d MMMM, yyyy");
  const [showNote, setShowNote] = useState<any>(null)
  
  return (
    <section id={format(parseISO(date), 'yyyy-MM-dd')} className="w-full bg-white rounded-lg px-2 sm:px-6 py-8">
      <div className="flex gap-4 items-center pb-6">
        <h5 className="font-semibold">{formattedDate}</h5>
        <p>–</p>
        <p className="text-purple-600">{bookings.length} appointment(s)</p>
      </div>

      <div className="text-xs sm:text-sm xl:text-base overflow-x-auto overflow-y-visible h-full hide-scrollbar w-full">
        <table className="w-full bg-white  ">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="py-3 px-4 text-left text-sm font-medium">Name</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium">
                Appointment Name
              </th>
              {/* <th className="py-3 px-4 text-left text-sm font-medium">
                Appointment Type
              </th> */}
              <th className="py-3 px-4 text-left text-sm font-medium">Notes</th>
              <th className="py-3 px-4 text-left text-sm font-medium">
                Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} showNote={showNote} setShowNote={setShowNote}/>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};


const GroupedBookingSections = ({
  groupedBookings,
}: {
  groupedBookings: GroupedBookings;
}) => (
  <div className="space-y-6 ">
    {Object.entries(groupedBookings).map(([date, bookings]) => (
      <BookingTable key={date} date={date} bookings={bookings} />
    ))}
  </div>
);


const Appointments = ({groupedBookingData,fetchedcount,fetchError}:{
  groupedBookingData: GroupedBookings | null;
  fetchError: string | null;
  fetchedcount: number;
}) => {
  const {user} = useUserStore()

  const { groupedBookings, count, error, isLoading, getBookings } = useGetBookings({
    groupedBookingData,fetchedcount,fetchError
  });

  // const [groupedBookings, setGroupBookings] = useState<GroupedBookings>();
  const [drop, setDrop] = useState(false);
  const [filter, setFilter] = useState("");
  const dropRef = useRef(null);

  useClickOutside(dropRef, () => setDrop(false));
  
  const fetchBookings = () => {
    if (filter === "upcoming") {
      getBookings("upcoming-appointments");
    } else {
      getBookings("past-appointments");
    }
  };

  // useEffect(() => {
  //   const dateHash = window.location.hash.substring(1)?.split('?')[0];
  //   if (user) {
  //     if (dateHash) {
  //       getBookings(dateHash);
  //     } else {
  //       fetchBookings();
  //     }
  //   }
  // }, [user]);

  const refresh =() => { 
    fetchBookings()
  };

  const selectView = (view: string) => {
    if(filter===view) return
    setFilter(view);
    if (view === "upcoming") {
      getBookings("upcoming-appointments");
    } else {
      getBookings("past-appointments");
    }
  };

  // useEffect(() => {
  //   if (!isLoading && !error && bookings?.length > 0) {
  //     setGroupBookings(groupBookingsByDate(bookings));
  //     const dateHash = window.location.hash.substring(1)?.split('?')[0];
  //     const element = document.getElementById(dateHash);
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // }, [bookings, isLoading, error]);

  // console.log({bookings, groupedBookings, user, isLoading},'====')
  // console.log({count})
  return (
    <>
      {/* <Reschedule refresh={refresh} /> */}

      <header className="flex w-full justify-between gap-4 flex-col sm:flex-row pb-10">
        <div>
          <h4 className="text-2xl font-semibold">Appointments</h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="">
            <button
              onClick={refresh}
              className="p-1.5 rounded-md bg-slate-200 text-slate-700 hover:shadow duration-200"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div ref={dropRef} className=" w-[15.5rem]">
            <div className=" relative rounded-full w-[15.5rem] bg-basePrimary p-0.5">
              <button
                onClick={() => setDrop((curr) => !curr)}
                className="py-2 w-full bg-white px-4 rounded-full flex justify-between gap-2 items-center text-sm"
              >
                <p>
                  {filter !== "past"
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

      <Suspense fallback={<div className="p-40 text-center">Loading...</div>}>
        {
        isLoading ? (
          // <PageLoading isLoading={isLoading} />
          <div className="p-40 text-center">Loading...</div>
        ) : 
        error ? (
          <section className="py-20 text-center w-full">{error}</section>
        ) 
        : !count? (
          <>Empty list</>
          // <Empty 
          //   placeholder="/appointments-placeholder.PNG"
          //   text={`You don't have any booked appointment. `}
          // />
        ) 
        : (
          groupedBookings && (
            <GroupedBookingSections groupedBookings={groupedBookings} />
          )
        )}
      </Suspense>
    </>
  );
};

export default Appointments;
