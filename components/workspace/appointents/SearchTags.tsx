"use client";

import { useAppointmentContext } from "@/context/AppointmentContext";
import { BookingsQuery } from "@/types/appointments";
import { format, isValid, parseISO } from "date-fns";
import { Dispatch, SetStateAction } from "react";

const SearchTags = ({
  params,
  setQuery,
  filterBookings,
  setCurrentPage,
  filter,
}: {
  params: BookingsQuery;
  filterBookings: (param: BookingsQuery) => any;
  setQuery: Dispatch<SetStateAction<string>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  filter:string;
  
}) => {
  const { setDateRange } = useAppointmentContext();

  // Filter out unwanted keys
  const filteredEntries = Object.entries(params).filter(
    ([key, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !["type", "date", "page"].includes(key)
  );

  // Function to parse JSON lists safely
  const parseJSONList = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join(", ") : value;
    } catch {
      return value; // Return as-is if not valid JSON
    }
  };

  // Handle Date Range
  const fromDate = params.from ? parseISO(params.from) : null;
  const toDate = params.to ? parseISO(params.to) : null;
  const hasDateRange = isValid(fromDate) && isValid(toDate);

  const removeFilter = async (key: keyof BookingsQuery) => {
    const updatedParams: Partial<BookingsQuery> = { ...params };
    delete updatedParams[key];

    // If removing the date range, remove both "from" and "to"
    if (key === "from" || key === "to") {
        delete updatedParams.from;
        delete updatedParams.to;
        setDateRange(undefined);
    }

    if (key === "search") {
        setQuery("");
    }

    // Remove page to avoid offset issues and reset pagination
    const { page, ...removedPage } = updatedParams;
    setCurrentPage(1);

    // If no filters remain, reset to default filter state
    if (Object.keys(removedPage).length === 0) {
      if (filter === "upcoming") {
        filterBookings({type:"upcoming-appointments"})
      } else {
        filterBookings({type:"past-appointments"})
      }
    } else {
        filterBookings(removedPage as BookingsQuery);
    }
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
              {parseJSONList(value as string)}
              {/* {key}: {parseJSONList(value as string)} */}
            </span>
            <button
              onClick={() => removeFilter(key as keyof BookingsQuery)}
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
            {format(fromDate!, "MMM dd, yyyy")} -{" "}{format(toDate!, "MMM dd, yyyy")}
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
