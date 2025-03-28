'use client'

import { createClient } from '@/utils/supabase/client';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const Testing = () => {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const now = new Date();
    const time24HoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const time25HoursFromNow = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    
    function formatDateToYYYYMMDD(date: Date): string {
      return date.toISOString().slice(0, 10); // Extracts only YYYY-MM-DD
    }
    
    const formattedTime24 = formatDateToYYYYMMDD(time24HoursFromNow);
    const formattedTime25 = formatDateToYYYYMMDD(time25HoursFromNow);

    const handleClick = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("bookings")
                .select(`id, phone, appointmentLinkId(smsNotification, id)`, { count: 'exact' })
                .ilike(`appointmentLinkId.smsNotification`, `SENT`)
                // .lte("appointmentDate", formattedTime25)
                // .gte("appointmentDate", formattedTime24);

            console.log({ data, error })
        } catch (error) {
            console.log({error})
        } finally {
            setLoading(false)
        }
    }


  return (
    <div className='flex'>
        <Button onClick={handleClick}> Submit {loading ? (<span >{' '}<Loader2 size={20} className='animate-spin'/></span>) : null}</Button>
    </div>
  )
}

export default Testing