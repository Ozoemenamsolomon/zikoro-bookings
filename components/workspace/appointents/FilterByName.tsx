import { PopoverMenu } from "@/components/shared/PopoverMenu";
import { BookingSlotSkeleton } from "@/components/shared/Loader";
import { fetchAppointmentNames } from "@/lib/server/appointments";
import useUserStore from "@/store/globalUserStore";
import { BookingsQuery } from "@/types/appointments";
import { Briefcase } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";

interface Appointment {
  appointmentName: string;
  businessName: string | null;
}

interface FilterByNameProps {
  onChange: (queryParams: BookingsQuery) => void;
  queryParams: BookingsQuery;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const FilterByName = ({ onChange, queryParams, setCurrentPage }: FilterByNameProps) => {
  const [appointmentNames, setAppointmentNames] = useState<Appointment[] | null>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const { currentWorkSpace } = useUserStore();

  useEffect(() => {
    if (!currentWorkSpace?.organizationAlias) return;

    const fetchData = async () => {
      setIsFetching(true);
      setError("");

      try {
        const { data, error } = await fetchAppointmentNames(currentWorkSpace.organizationAlias!);

        if (error) {
          setError(error || "Failed to fetch appointment names");
          return;
        }

        setAppointmentNames(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch appointment names");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [currentWorkSpace?.organizationAlias]);


  // Extract selected team members from queryParams when page loads
  const selectedAppointments = useMemo(() => {
    return queryParams.appointmentName ? JSON.parse(queryParams.appointmentName) : [];
  }, [queryParams.appointmentName]);

  // Toggle selection and update queryParams + trigger filtering
  const toggleSelection = (appointmentName: string) => {
      const isAlreadySelected = selectedAppointments.includes(appointmentName);
      const updatedSelection = isAlreadySelected
        ? selectedAppointments.filter((name: string) => name !== appointmentName)
        : [...selectedAppointments, appointmentName];

      // remove page to avoid offset errors
      const { type, date, page, ...rest } = queryParams
      const newQueryParams = {
        ...rest,
        appointmentName: updatedSelection.length > 0 ? JSON.stringify(updatedSelection) : null,
      };
      setCurrentPage(1)
      onChange(newQueryParams); // Trigger filtering
  };

  return (
    <PopoverMenu
      trigerBtn={
        <button className="flex gap-2 items-center">
          <Briefcase size={16} />
          <small>Appointment name</small>
        </button>
      }
      className="w-44 overflow-auto no-scrollbar"
    >
      <div className="p-4 py-5 text-wrap text-[12px]">
        {isFetching ? (
          <BookingSlotSkeleton size={4} />
        ) : error ? (
          <div className="text-red-500 py-24 text-center">{error}</div>
        ) : appointmentNames?.length === 0 ? (
          <div className="text-gray-500 py-24 text-center">No appointments found.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {appointmentNames?.map(({ appointmentName, businessName }, i) => (
              <button
                key={i}
                className={`px-2 py-1 hover:bg-gray-50 flex flex-col rounded text-left w-full ${
                  selectedAppointments.includes(appointmentName) ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => toggleSelection(appointmentName)}
              >
                <span>{appointmentName}</span>
                <small>{businessName}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    </PopoverMenu>
  );
};

export default FilterByName;
