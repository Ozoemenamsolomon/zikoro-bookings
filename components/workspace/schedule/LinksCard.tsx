'use client'

import { ClockIcon, EditPenBoxIcon, MapPin, ShareIcon, urls } from '@/constants'
import { AppointmentLink } from '@/types/appointments'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Share from './Share'
import CopyLinkButton from '../ui/CopyLinkButton'
import {toast} from 'react-toastify'
import { useAppointmentContext } from '@/context/AppointmentContext'

const LinksCard = ({data,}:{data:AppointmentLink|any}) => {
    const {getWsUrl} = useAppointmentContext()
    const [item, setItem] = useState<AppointmentLink>(data)
    const [loading, setLoading] = useState(false) 
    const [isShare, setIsShare] = useState<number|null|bigint>(null)
    // const [isDisabled, setIsDisabled] = useState(data?.statusOn)

    const changeStatus = async (newState:boolean) => {
        setLoading(true)
        setItem({...item, statusOn: newState})
        try {
            const payload = { ...item, statusOn: newState,};
            const response = await fetch('/api/schedules/editstatus', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              });
            const {error} = await response.json();
            if (response.ok && !error) {
                toast.success('Status changed.')
              } else {
                setItem({...item, statusOn: !newState})
                toast.error('Unsuccessful! Error occured')
              }
        } catch (error) {
            setItem({...item, statusOn: !newState})
            toast.error('Unsuccessful! Error occured')
            console.log('Service not available')
        } finally {
            setLoading(false)
        }
    }

    const backgroundColor = hexToRgba(item?.brandColour!, 0.05); // 0.05 is the opacity value (5%)
    const isDisabled = item?.statusOn === false

    const [linkorigin, setLink] = useState('')
    useEffect(() => {
      const url = window.location.origin
      setLink(url)
    }, [ ])
    
  return (
        <div
        style={{
            backgroundColor: !isDisabled ? backgroundColor : '',
            borderColor: !isDisabled ?item?.brandColour! : '',
        }}
        className={` max-[520px]:max-w-80 w-full p-4 border-2 space-y-2 rounded-lg h-full ${item?.statusOn ? '':'text-gray-300'} `}
        >
        <div className="flex  justify-between gap-6 items-center">
            <h4 className="text-lg font-medium">{item?.appointmentName}</h4>
            <Link className={item?.statusOn ? '':'opacity-20'} aria-disabled={item?.statusOn} href={`${getWsUrl(urls.edit)}?appointmentAlias=${item?.appointmentAlias}`}><EditPenBoxIcon/> </Link >
        </div>

        <div className="">
            <div className=" flex  gap-4 items-center">
                <div  className={item.statusOn ? '':'opacity-20'}><ClockIcon/></div>
                <p className="">{item?.duration} minutes</p>
            </div>
            <div className="flex  gap-4 items-center">
                <div className={item.statusOn ? '':'opacity-20'}><MapPin/> </div>
                <p className="">{item?.loctionType}</p>
            </div>
        </div>

        <div className="flex justify-between gap-6 items-center">
            <p className=" font-medium">Status</p>
            <div
                className={` flex-shrink-0 ${item?.statusOn ? 'bg-blue-600 ring-blue-600 ring-2 ' : 'bg-gray-300 ring-2 ring-gray-300'} mr- w-14 h-6 p-1.5  relative flex items-center  rounded-full  cursor-pointer `}
                onClick={() => changeStatus(!item?.statusOn )}
            >   
                <div className="flex w-full justify-between font-semibold text-[9px]"> <p className='text-white'>ON</p><p className='text-gray-50'>OFF</p>  </div>
                <div className={`bg-white absolute inset-0 w-7 h-6 flex-shrink-0 rounded-full transition-transform duration-200 transform ${item?.statusOn  ? 'translate-x-7' : ''}`}></div>
            </div>
        </div>

        <hr className="font-bold border" />


      <div className="flex   justify-between gap-6 items-center">
        <CopyLinkButton 
            link={`${linkorigin}/book-appointment/${item?.appointmentAlias}`}
            // link={`https://zikoro.com/booking/${item?.appointmentAlias}`}
        >
            <button  disabled={!item?.statusOn} type='button' className="underline">Copy link</button>
        </CopyLinkButton>

        <Share data={item}  />
            
        </div>

        
    </div>
  )
}

export default LinksCard


// Helper function to convert hex to RGBA
export const hexToRgba = (hex: string | null | undefined, alpha: number): string => {
    if (!hex || hex[0] !== '#' || hex.length !== 7) {
      // Return a default color (black) with the given alpha if the input is invalid
      return `rgba(0, 0, 0, ${alpha})`;
    }
    
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  