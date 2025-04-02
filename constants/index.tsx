import { Booking } from "@/types/appointments";

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
 

export const subscriptionPlans = [
      {
        label: "Free",
        value: 0,
        features: [
          "Unlimited events",
          "Attendee check-in",
          "3 discount coupons",
          "No engagement feature",
        ],
      },
      {
        label: "Lite",
        value: 110,
        features: [
          "Everything in Free Plus",
          "200 Attendees/ engagement feature",
          "RSVP responses & tracking",
          "Data import/export",
          "3 Live quiz, 3 polls & Unlimited Q&A",
        ],
      },
      {
        label: "Professional",
        value: 240,
        features: [
          "Everything in Lite plus",
          "1000 attendees/ engagement features",
          "Unlimited Affiliates",
          "5 partner virtual booth",
          "Unlimited sessions/event",
        ],
      },
      {
        label: "Enterprise",
        value: 480,
        features: [
          "Everything in Professional Plus",
          "5000 Attendees/ engagement features",
          "Unlimited engagement features",
          "10 partner virtual booth",
          "Unlimited discount coupons/ event",
        ],
      },
    ];
    

    