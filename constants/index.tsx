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
          "Max number of bookings - 10/month",
          "Email notification and reminder",
          "No SMS notification and reminder",
          "No team member",
        ],
      },
      {
        label: "Lite",
        value: 5,
        features: [
          "Max number of bookings - 100/month",
          "Email notification and reminder",
          "SMS notification and reminder",
          "No team member",
        ],
      },
      {
        label: "Professional",
        value: 15,
        features: [
          "Max number of bookings - 500/month",
          "Email notification and reminder",
          "SMS notification and reminder",
          "3 team members",
        ],
      },
      {
        label: "Enterprise",
        value: 40,
        features: [
          "Max number of bookings - 2000/month",
          "Email notification and reminder",
          "SMS notification and reminder",
          "10 team members",
        ],
      },
    ];
    

    
    export const subscriptionPlansValue = [
      {
        label: "Free",
        value: 0,
        features: {
          maxBookingsPerMonth: 10,
          emailNotification: true,
          smsNotification: false,
          teamMembers: 0,
        },
      },
      {
        label: "Lite",
        value: 5,
        features: {
          maxBookingsPerMonth: 100,
          emailNotification: true,
          smsNotification: true,
          teamMembers: 0,
        },
      },
      {
        label: "Professional",
        value: 15,
        features: {
          maxBookingsPerMonth: 500,
          emailNotification: true,
          smsNotification: true,
          teamMembers: 3,
        },
      },
      {
        label: "Enterprise",
        value: 40,
        features: {
          maxBookingsPerMonth: 2000,
          emailNotification: true,
          smsNotification: true,
          teamMembers: 10,
        },
      },
    ];
    