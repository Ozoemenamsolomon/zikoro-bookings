import { DropMenu } from '@/components/shared/DropMenu'
import { BookingSlotSkeleton } from '@/components/shared/Loader';
import { fetchAppointmentNames } from '@/lib/server/appointments';
import useUserStore from '@/store/globalUserStore';
import { Briefcase, Users2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const FilterByName = ({onChange}:{onChange:(appointmentName:string)=>void}) => {
    const [appointmentNames, setAppointmentNames] = useState< { appointmentName: string; businessName: string | null }[] | null>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');
    const { currentWorkSpace } = useUserStore();
  
    useEffect(() => {
      if (!currentWorkSpace?.workspaceAlias) return;
  
      const fetchData = async () => {
        setIsFetching(true);
        setError('');
        
        try {
          const { data, error, count } = await fetchAppointmentNames(currentWorkSpace.workspaceAlias);
// console.log({ data, error, count })

          if (error) {
            setError(error|| 'Failed to fetch appointment names');
          };
          setAppointmentNames(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch appointment names');
        } finally {
          setIsFetching(false);
        }
      };
      
  
      fetchData();
    }, [currentWorkSpace?.workspaceAlias]);
  
    return (
      <DropMenu
        trigerBtn={
          <button className="  flex gap-2 items-center">
                <Briefcase size={16} />
                <small>Appointment name</small>
            </button>
        }
      >
        <div className="p-4 py-5  max-w-60 overflow-auto text-wrap no-scrollbar text-[12px] ">
          {isFetching ? (
            <BookingSlotSkeleton size={4} />
          ) : error ? (
            <div className="text-red-500 py-24 text-center  text-wrap ">{error}</div>
          ) : appointmentNames?.length === 0 ? (
            <div className="text-gray-500 py-24 text-center  text-wrap ">No team members found.</div>
          ) : (
            <div className="flex flex-col gap-1">
              {appointmentNames?.map(({appointmentName, businessName}, i) => (
                <button
                  key={i}
                  className="px-2 py-1 hover:bg-gray-50 flex flex-col rounded text-left w-full"
                  onClick={() => onChange(appointmentName!)}
                >
                  <span>{appointmentName}</span>
                  <small>{businessName}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </DropMenu>
    );
}

export default FilterByName