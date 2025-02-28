"use client";

import { useAppointmentContext } from "@/context/AppointmentContext";
import { BookingsQuery } from "@/types/appointments";
import { format, isValid, parseISO } from "date-fns";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

const SearchTags = ({
  params,
  setQueryParams,
  filterBookings,
}: {
  params: BookingsQuery;
  filterBookings: (param: BookingsQuery) => any;
  setQueryParams: Dispatch<SetStateAction<BookingsQuery>>;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const {setDateRange} = useAppointmentContext()

  // Filter out unwanted keys
  const filteredEntries = Object.entries(params).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !["type", "date", "page"].includes(key)
  );

  // Handle Date Range
  const fromDate = params.from ? parseISO(params.from) : null;
  const toDate = params.to ? parseISO(params.to) : null;
  const hasDateRange = isValid(fromDate) && isValid(toDate);

  // Function to remove a query parameter
  const removeFilter = async (key: string) => {
    const updatedParams = { ...params };
    delete updatedParams[key];

    // If removing the date range, remove both "from" and "to"
    if (key === "from" || key === "to") {
      delete updatedParams.from;
      delete updatedParams.to;
    }

    // Update state and refetch
    setQueryParams(updatedParams);
    await filterBookings(updatedParams);

    // Update URL search params
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(key);
    if (key === "from" || key === "to") {
      newParams.delete("from");
      newParams.delete("to");
      setDateRange(undefined)
    }
    replace(`${pathname}?${newParams.toString()}`);
  };

  if (filteredEntries.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 pt-2 text-[12px]">
      {filteredEntries
        .filter(([key]) => key !== "from" && key !== "to") // Exclude date fields here
        .map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-0.5 rounded-full"
          >
            <span className="capitalize">
              {key}: {value}
            </span>
            <button
              onClick={() => removeFilter(key)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        ))}

      {/* Display Date Range as a Single Tag */}
      {hasDateRange && (
        <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-0.5 rounded-full">
          <span>
            Date: {format(fromDate!, "MMM dd, yyyy")} -{" "}
            {format(toDate!, "MMM dd, yyyy")}
          </span>
          <button
            onClick={() => removeFilter("from")}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTags;
