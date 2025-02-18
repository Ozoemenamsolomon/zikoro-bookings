import { useState } from "react";
import { DropMenu } from "@/components/shared/DropMenu";
import { AppointmentStatuses, Box, StatusIcon, TickedBox } from "@/constants";


const FilterByStatus = ({onChange}:{onChange:(status:string)=>void}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleClick = async (status:string) => {
    setSelectedStatus(status)
    onChange(status)
  }

  return (
    <DropMenu
      trigerBtn={
        <button className="flex gap-2 items-center">
          <StatusIcon width={16} height={16} />
          <small>{"Status"}</small>
        </button>
      }
    >
      <div className="px-3 py-5 space-y-1  bg-white shadow-lg rounded-md">
        {AppointmentStatuses.map(({label,value}, i) => (
          <button
            key={i}
            className={`flex hover:-translate-y-1 duration-300 items-center gap-3 w-full text-[12px]`}
            onClick={() => handleClick(value)}
          >
            <span>
              {
              selectedStatus === value ? 
                <TickedBox width={10} hanging={10} />
                :
                <Box width={10} hanging={10} />
              }
            </span>
            {label}
          </button>
        ))}
      </div>
    </DropMenu>
  );
};

export default FilterByStatus;
