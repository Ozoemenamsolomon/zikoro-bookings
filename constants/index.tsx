export * from "./icons"
export * from "./timezones"
export * from "./urls"
export * from "./settings"

export const AppointmentStatuses = [
  { label: "In attendance", value: "IN ATTENDANCE" },
  // { label: "Upcoming", value: "UPCOMING" },
  // { label: "Rescheduled", value: "RESCHEDULED" },
  // { label: "Cancelled", value: "CANCELLED" },
  { label: "No show", value: "NO SHOW" },
];

export const reactquilToolbar =
    () => ({
      toolbar: [
        [{ font: ['sans-serif', 'serif', 'monospace', 'cursive'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: ['', 'center', 'right', 'justify'] }],
        ['clean'],
      ],
    })
 
