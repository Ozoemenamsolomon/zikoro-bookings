import { Separator } from '@/components/ui/separator'
import { FilterIcon,   } from '@/constants'
import React, { useState } from 'react'
import FitlerByDate from './FitlerByDate'
import FilterByName from './FilterByName'
import FilterByTeamMemebr from './FilterByTeamMemebr'
import FilterByStatus from './FilterByStatus'
import { BookingsQuery } from '@/types/appointments'
import { Search } from 'lucide-react'

const SearchAppointment = ({filterBookings, queryParams}:{
    filterBookings:(param:BookingsQuery)=>any,
    queryParams?: BookingsQuery
}) => {
    const [query, setQuery] = useState('')

    const handleChange = async (q:string) => {
        setQuery(q)
        if(q===''){
            await filterBookings({type:'upcoming-appointments'})
        }
    }

    const handleSearch = async () => {
        if(query==='') return
        await filterBookings({search:query})
    }

  return (
    <section className="pb-8 max-w-3xl mx-auto overflow-auto no-scrollbar">
        <div className="flex max-w-md mx-auto w-full gap-2 items-end ">
            <input
                type='search'
                placeholder='Search by appointment name, attendee name'
                className='border-b bg-transparent px-3 border-input flex-1 focus:outline-none focus-within:outline-none py-2 text-sm  '
                value={query}
                name='query'
                id='query'
                onChange={(e)=>handleChange(e.target.value)}
            />
            <div  className="flex gap-1 items-center shrink-0 ">
                {query?.length ? <button onClick={handleSearch} type="button" className='rounded-full border h-8 w-8 flex items-center justify-center bg-white shrink-0'>
                    <Search size={20} className='shrink-0 text-blue-600'/>
                </button> : null}
                <div className="shrink-0"><FilterIcon  /></div>
            </div>
        </div>

        <div className="pt-4 text-nowrap flex w-full gap-4 items-center justify-between ">
            <FitlerByDate 
                onChange={async (date:Date|undefined)=> await filterBookings({appointmentDate:date?.toISOString()})}
                value={queryParams?.appointmentDate ? new Date(queryParams?.appointmentDate!) : new Date()}  
            />
            {/* <Separator orientation='vertical' className='h-6'/> */}
            <FilterByName  onChange={async (appointmentName:string)=> await filterBookings({appointmentName})}/>
            {/* <Separator orientation='vertical'  className='h-6'/> */}
            <FilterByTeamMemebr onChange={async (teamMember:string)=> await filterBookings({teamMember})}/>
            {/* <Separator  orientation='vertical' className='h-6' /> */}
            <FilterByStatus onChange={async (status:string)=> await filterBookings({status})}/>
        </div>
    </section>
  )
}

export default SearchAppointment