import { FilterIcon } from '@/constants'
import React, { Dispatch, SetStateAction, useState } from 'react'
import FitlerByDate from './FitlerByDate'
import FilterByName from './FilterByName'
import FilterByTeamMemebr from './FilterByTeamMemebr'
import FilterByStatus from './FilterByStatus'
import { BookingsQuery } from '@/types/appointments'
import { Search } from 'lucide-react'
import { DateRange } from 'react-day-picker'

const SearchAppointment = ({ filterBookings, queryParams,setQueryParams, filter }: {
    filterBookings: (param: BookingsQuery) => any,
    queryParams: BookingsQuery, filter:string
    setQueryParams: Dispatch<SetStateAction<BookingsQuery>>
}) => {
    const [query, setQuery] = useState('')
    const [drop, setDrop] = useState(true)

    const handleChange = async (q: string) => {
        setQuery(q)
        if (q === '') {
            await filterBookings({ type: filter==='upcoming'?'upcoming-appointments':'past-appointments' })
        }
    }

    const handleSearch = async () => {
        if (query === '') return
        await filterBookings({ search: query })
    }

    return (
        <section className="pb-8 w-full">
            <div className="flex max-w-md mx-auto w-full gap-2 items-end">
                <input
                    type='search'
                    placeholder='Search by appointment name, attendee name'
                    className='border-b bg-transparent px-3 border-input flex-1 focus:outline-none focus-within:outline-none py-2 text-sm'
                    value={query}
                    name='query'
                    id='query'
                    onChange={(e) => handleChange(e.target.value)}
                />
                <div className="flex gap-1 items-center shrink-0">
                    {query?.length ? (
                        <button onClick={handleSearch} type="button" className='rounded-full border h-8 w-8 flex items-center justify-center bg-white shrink-0'>
                            <Search size={20} className='shrink-0 text-blue-600' />
                        </button>
                    ) : null}
                    <button className="shrink-0" onClick={() => setDrop(curr => !curr)}>
                        <FilterIcon />
                    </button>
                </div>
            </div>

            {/* Filter Dropdown */}
            <div 
                className={`transition-[transform,opacity] duration-300 ease-out overflow-hidden transform ${drop ? "scale-y-100 opacity-100 block" : "scale-y-0 opacity-0 hidden"} origin-top`}
            >
                <div className="pt-4 flex w-full overflow-auto no-scrollbar gap-4 items-center justify-between max-w-3xl mx-auto">
                    <FitlerByDate
                        onChange={
                            async (date: DateRange | undefined) => 
                                await filterBookings({ from: date?.from?.toISOString(), to: date?.to?.toISOString() })}
                        value={queryParams?.from && queryParams?.to ? 
                            {from :  new Date(queryParams?.from!), to: new Date(queryParams?.to!)} : undefined}
                    />
                    <FilterByName 
                        onChange={async (appointmentName: string|null) => await filterBookings({ appointmentName })}
                        queryParams={queryParams!}
                        setQueryParams={setQueryParams}
                    />
                    <FilterByTeamMemebr 
                        onChange={async (teamMember: string|null) => await filterBookings({ teamMember })} 
                        queryParams={queryParams!}
                        setQueryParams={setQueryParams}
                    />
                    <FilterByStatus 
                        onChange={async (status: string|null) => await filterBookings({ status })}
                        queryParams={queryParams!}
                        setQueryParams={setQueryParams}
                    />
                </div>
            </div>
        </section>
    )
}

export default SearchAppointment
