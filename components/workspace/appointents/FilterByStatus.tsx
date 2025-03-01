import { useMemo } from "react";
import { PopoverMenu } from "@/components/shared/PopoverMenu";
import { AppointmentStatuses, Box, StatusIcon, TickedBox } from "@/constants";
import { BookingsQuery } from "@/types/appointments";
import { Dispatch, SetStateAction } from "react";

interface FilterByStatusProps {
  onChange: (queryParams: BookingsQuery) => void;
  queryParams: BookingsQuery;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const FilterByStatus = ({ onChange, queryParams, setCurrentPage }: FilterByStatusProps) => {
  // Extract selected team members from queryParams when page loads
  const selectedStatuses = useMemo(() => {
    return queryParams.status ? JSON.parse(queryParams.status) : [];
  }, [queryParams.status]);

  const toggleSelection = (status: string) => {
      const isAlreadySelected = selectedStatuses.includes(status);
      const updatedSelection = isAlreadySelected
        ? selectedStatuses.filter((s: string) => s !== status) // Remove if already selected
        : [...selectedStatuses, status]; // Add if not selected
        // remove page to avoid ofset errors
        const { type, date,page, ...rest } = queryParams
        const newQueryParams = {
          ...rest,
        status: updatedSelection.length > 0 ? JSON.stringify(updatedSelection) : null,
      };
      setCurrentPage(1)

      onChange(newQueryParams); // Trigger filtering
  };

  return (
    <PopoverMenu
      trigerBtn={
        <button className="flex gap-2 items-center">
          <StatusIcon width={16} height={16} />
          <small>{"Status"}</small>
        </button>
      }
      className="w-40"
    >
      <div className="px-3 py-5 space-y-1">
        {AppointmentStatuses.map(({ label, value }, i) => (
          <button
            key={i}
            className="flex hover:-translate-y-1 duration-300 items-center gap-3 w-full text-[12px]"
            onClick={() => toggleSelection(value)}
          >
            <span>
              {selectedStatuses.includes(value) ? (
                <TickedBox width={10} height={10} />
              ) : (
                <Box width={10} height={10} />
              )}
            </span>
            {label}
          </button>
        ))}
      </div>
    </PopoverMenu>
  );
};

export default FilterByStatus;
