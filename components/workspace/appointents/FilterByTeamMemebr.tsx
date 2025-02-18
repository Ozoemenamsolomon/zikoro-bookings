import { DropMenu } from '@/components/shared/DropMenu';
import Loading, { BookingSlotSkeleton } from '@/components/shared/Loader';
import { fetchTeamMembers } from '@/lib/server/workspace';
import useUserStore from '@/store/globalUserStore';
import { BookingTeamMember } from '@/types';
import { Users2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const FilterByTeamMember = ({ onChange }: { onChange: (teamMember: string) => void }) => {
  const [teamMembers, setTeamMembers] = useState<BookingTeamMember[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const { currentWorkSpace } = useUserStore();

  useEffect(() => {
    if (!currentWorkSpace?.workspaceAlias) return;

    const fetchData = async () => {
      setIsFetching(true);
      setError('');
      try {
        const { data, error } = await fetchTeamMembers(currentWorkSpace.workspaceAlias);
        if (error) throw new Error(error);
        console.log({data,error})
        setTeamMembers(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch team members');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [currentWorkSpace?.workspaceAlias]);

  return (
    <DropMenu
      trigerBtn={
        <button className="flex gap-2 items-center">
          <Users2 size={16} />
          <small>Team member</small>
        </button>
      }
    >
      <div className="p-4 py-5  max-w-60 overflow-auto text-wrap no-scrollbar text-[12px] ">
        {isFetching ? (
          <BookingSlotSkeleton size={4} />
        ) : error ? (
          <div className="text-red-500 py-24 text-center  text-wrap ">{error}</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-gray-500 py-24 text-center  text-wrap ">No team members found.</div>
        ) : (
          <div className="flex flex-col gap-">
            {teamMembers.map(({userId,email}, i) => (
              <button
                key={i}
                className="px-2 py-1 hover:bg-gray-50 flex flex-col rounded text-left w-full"
                onClick={() => onChange(email!)}
              >
                <span>{userId?.firstName + " " + userId?.lastName}</span>
                <small className='text-gray-500'>{email}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </DropMenu>
  );
};

export default FilterByTeamMember;
