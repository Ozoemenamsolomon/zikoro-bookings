'use client'

import React, { useEffect, useState } from 'react'
import { AppointmentLink, BookingsContact } from '@/types/appointments'
import EmptyList from '../ui/EmptyList'
import { ChevronLeft } from 'lucide-react'
import { CenterModal } from '@/components/shared/CenterModal'
import { useGetSchedules } from '@/hooks/services/appointments'
import PaginationMain from '@/components/shared/PaginationMain'
import useUserStore from '@/store/globalUserStore'

const ScheduleAppointment = ({ contact, appointmentLinks }: { contact: BookingsContact, appointmentLinks: AppointmentLink[] }) => {
  const [show, setShow] = useState<'links' | 'date' | 'final'>('links')
  const [selectedAppointmentLink, setSelectedAppointmentLink] = useState<AppointmentLink | null>(null)
  const {user} = useUserStore()
  // Fetching schedule data using custom hook
  const { fetchSchedules, handlePageChange, totalPages, loading, currentPage, scheduleList, isError } = useGetSchedules()

  useEffect(() => {
    fetchSchedules() // Fetch schedules when component mounts
  }, [user])

  return (
    <CenterModal
      className="w-full max-w-3xl"
      trigerBtn={
        <button onClick={() => setShow('links')} className="p-3 w-full bg-basePrimary text-center text-white rounded-md">
          Schedule Appointment
        </button>
      }
    >
      {show === 'links' && (
        <SelectAppointmentLink
          contact={contact}
          setShow={setShow}
          selectedAppointmentLink={selectedAppointmentLink}
          setSelectedAppointmentLink={setSelectedAppointmentLink}
          scheduleList={scheduleList}
          loading={loading}   currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} isError={isError}
        />
      )}
      {show === 'date' && selectedAppointmentLink && (
        <SelectDateTime selectedAppointmentLink={selectedAppointmentLink} setShow={setShow} />
      )}
      {show === 'final' && <Successful attendee={`${contact?.firstName} ${contact?.lastName}`} />}
    </CenterModal>
  )
}

export default ScheduleAppointment

const SelectAppointmentLink = ({
  contact,
  setShow,
  selectedAppointmentLink,
  setSelectedAppointmentLink,
  scheduleList,loading,   currentPage, totalPages, handlePageChange, isError 
}: {
  contact: BookingsContact
  setShow: React.Dispatch<React.SetStateAction<'links' | 'date' | 'final'>>
  selectedAppointmentLink: AppointmentLink | null
  setSelectedAppointmentLink: React.Dispatch<React.SetStateAction<AppointmentLink | null>>
  scheduleList: AppointmentLink[]
  loading:boolean, currentPage:number, totalPages:number, handlePageChange:(page:number)=>void, isError:string 
}) => {

  const handleAppointmentClick = (item: AppointmentLink) => {
    setSelectedAppointmentLink(item)
  }

  const handleNextClick = () => {
    if (selectedAppointmentLink) {
      setShow('date')
    }
  }

  return (
    <section className="w-full rounded-md">
      <div className="bg-baseLight px-6 py-6 text-lg border-b w-full">
        <div className="max-w-lg mx-auto text-center">
          <h6>
            Select Appointment type to schedule an appointment with
            <span className="capitalize font-semibold pl-2">
              {contact?.firstName?.toUpperCase() ?? ''} {contact?.lastName?.toUpperCase() ?? ''}
            </span>
          </h6>
        </div>
      </div>

      <div className="max-h-[65vh] max-w-xl w-full mx-auto overflow-auto hide-scrollbar px-6 pb-4 pt-4 space-y-4 min-h-80">
        {loading ? (
          <section className="space-y-2 w-full">
            {[...Array(4)].map((_, i) => (
              <div className="animate-pulse h-12 w-full bg-slate-200" key={i}></div>
            ))}
          </section>
        ) : isError ? (
          <EmptyList size="30" text={isError || 'An error occurred'} />
        ) : !scheduleList?.length ? (
          <EmptyList size="30" text="No schedules" />
        ) : (
          <>
            {scheduleList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAppointmentClick(item)}
                className={`rounded-md w-full border p-3 hover:border-basePrimary duration-300 flex gap-2
                  ${selectedAppointmentLink?.id === item.id ? 'bg-slate-100' : ''}`}
              >
                <div className="w-1 min-h-full shrink-0" style={{ backgroundColor: item?.brandColour! }}></div>
                <div className="text-start">
                  <h6 className="font-medium">{item?.appointmentName}</h6>
                  <div className="flex gap-2">
                    <p>{item.loctionType}:</p>
                    <p>{item.locationDetails}</p>
                  </div>
                </div>
              </div>
            ))}
            <PaginationMain currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      <div className="bg-white px-6 py-4 flex justify-center border-t w-full">
        <button
          disabled={!selectedAppointmentLink}
          onClick={handleNextClick}
          className="py-2 px-6 bg-basePrimary text-center text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </section>
  )
}

const SelectDateTime = ({
  selectedAppointmentLink,
  setShow,
}: {
  selectedAppointmentLink: AppointmentLink
  setShow: React.Dispatch<React.SetStateAction<'links' | 'date' | 'final'>>
}) => {
  const handleSubmit = () => {
    setShow('final')
  }

  return (
    <section className="max-w-3xl w-full rounded-md bg-white min-h-80">
      <div className="bg-baseLight px-6 py-4 z-10 text-lg border-b w-full">
        <button onClick={() => setShow('links')} className="bg-white rounded-full border p-1 shrink-0">
          <ChevronLeft size={18} />
        </button>
        <h6 className="w-full text-center">Select date and time</h6>
      </div>

      <section className="p-2 w-full">
        {/* Placeholder for Calender component */}
        <div className="text-center">Calender Component</div>
      </section>

      <div className="bg-white px-6 py-4 flex justify-center border-t w-full">
        <button onClick={handleSubmit} className="py-2 px-6 bg-basePrimary text-center text-white rounded-md">
          Confirm
        </button>
      </div>
    </section>
  )
}

const Successful = ({ attendee }: { attendee: string }) => {
  return (
    <section className="max-w-3xl w-full rounded-md bg-white">
      <div className="bg-baseLight h-20 w-full border-b"></div>

      <div className="px-6 py-12 text-center">
        <h4 className="text-xl font-semibold">Appointment Booked</h4>
        <p>
          <span className="capitalize">{attendee}</span> will be notified
        </p>
      </div>
    </section>
  )
}
