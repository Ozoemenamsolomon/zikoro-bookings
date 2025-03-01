import { useEffect, useMemo, useState } from "react";
import { PopoverMenu } from "@/components/shared/PopoverMenu";
import { BookingSlotSkeleton } from "@/components/shared/Loader";
import { fetchTeamMembers } from "@/lib/server/workspace";
import useUserStore from "@/store/globalUserStore";
import { BookingTeamMember } from "@/types";
import { Users2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { BookingsQuery } from "@/types/appointments";

interface FilterByTeamMemberProps {
  onChange: (queryParams: BookingsQuery) => void;
  queryParams: BookingsQuery;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const FilterByTeamMember = ({ onChange, queryParams, setCurrentPage }: FilterByTeamMemberProps) => {
  const [teamMembers, setTeamMembers] = useState<BookingTeamMember[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const { currentWorkSpace } = useUserStore();

  useEffect(() => {
    if (!currentWorkSpace?.workspaceAlias) return;

    const fetchData = async () => {
      setIsFetching(true);
      setError("");
      try {
        const { data, error } = await fetchTeamMembers(currentWorkSpace.workspaceAlias);
        if (error) throw new Error(error);
        setTeamMembers(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch team members");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [currentWorkSpace?.workspaceAlias]);

  // Extract selected team members  
  const selectedTeamMembers = useMemo(() => {
    return queryParams.teamMember ? JSON.parse(queryParams.teamMember) : [];
  }, [queryParams.teamMember]);

  // toggle and trigger filtering
  const toggleSelection = (email: string) => {
      const isAlreadySelected = selectedTeamMembers.includes(email);
      const updatedSelection = isAlreadySelected
        ? selectedTeamMembers.filter((item: string) => item !== email) // Remove if already selected
        : [...selectedTeamMembers, email]; // Add if not selected

      // remove and reset page to 1 to avoid ofset errors
      const { type, date,page, ...rest } = queryParams
      const newQueryParams = {
          ...rest,
        teamMembers: updatedSelection.length > 0 ? JSON.stringify(updatedSelection) : null,
      };
      setCurrentPage(1)

      onChange(newQueryParams); // Trigger filtering
  };

  return (
    <PopoverMenu
      trigerBtn={
        <button className="flex gap-2 items-center">
          <Users2 size={16} />
          <small>Team member</small>
        </button>
      }
      className="w-44 overflow-auto no-scrollbar"
    >
      <div className="p-4 py-5 text-wrap text-[12px]">
        {isFetching ? (
          <BookingSlotSkeleton size={4} />
        ) : error ? (
          <div className="text-red-500 py-24 text-center">{error}</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-gray-500 py-24 text-center">No team members found.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {teamMembers.map(({ userId, email }, i) => (
              <button
                key={i}
                className={`px-2 py-1 hover:bg-gray-50 flex flex-col rounded text-left w-full ${
                  selectedTeamMembers.includes(email!) ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => toggleSelection(email!)}
              >
                <span>{userId?.firstName + " " + userId?.lastName}</span>
                <small className="text-gray-500">{email}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </PopoverMenu>
  );
};

export default FilterByTeamMember;
