import Booking from '@/components/workspace/booking';
import { fetchSchedule } from '@/lib/server/schedules';
import React from 'react'

const BookAppointmentPage = async ({params:{ alias }} : {params: { alias: string }}) => {
    const {data,error} = await fetchSchedule(alias)
    return <Booking appointmnetLink={data!} error={error} />;
}

export default BookAppointmentPage