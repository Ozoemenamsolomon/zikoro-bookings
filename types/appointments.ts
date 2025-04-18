export interface AppointmentLink {
    id?: bigint;
    created_at?: string;
    appointmentName: string;
    workspaceId?: string;
    category: any;
    duration: number|null;
    loctionType: string;
    locationDetails: string;
    timeZone: string;
    timeDetails: string   ;
    curency: string;
    amount: number;
    paymentGateway: string;
    maxBooking: number;
    sessionBreak: number;
    statusOn: boolean;
    note: string;
    appointmentAlias: string;
    createdBy: any;
    businessName: string | null;
    logo: string | null;
    brandColour: string | null;
    teamMembers: string | null;
    zikoroBranding: string | null;
    isPaidAppointment?: boolean;
    smsNotification?:string;
}
export interface AppointmentFormData {
  id?: bigint;
  created_at?: string;
  appointmentName: string;
  category: any;
  // category: string|Category[];
  duration: number|null;
  loctionType: string;
  locationDetails: string;
  timeZone: string;
  timeDetails: any ;
  // timeDetails:  DaySchedule[] ;
  curency: string;
  amount: number|null;
  paymentGateway: string;
  maxBooking: number|null;
  sessionBreak: number|null;
  statusOn: boolean;
  note: string;
  appointmentAlias: string;
  createdBy: any;
  businessName: string | null;
  logo: string | null;
  brandColour: string | null;
  teamMembers: string | null;
  zikoroBranding: string | null | boolean;
  files?:File[] | null;
  isPaidAppointment?: boolean;
  smsNotification?:string;
}

export interface FormProps {
  formData?: AppointmentFormData;
  setFormData?: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  errors?: any;
  setErrors?: React.Dispatch<React.SetStateAction<any>>;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange?:  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface DetailItem {
  title: string;
  icon: JSX.Element;
  description: string;
  formComponent: React.FC<FormProps>;
}

export interface Booking {
  id?: number;
  created_at?: string;
  address?:string;
  appointmentLinkId?: any;
  participantEmail?: string;
  appointmentDate?: Date | string | null;
  appointmentTime?: string | null;
  scheduleColour?: string | null;
  teamMembers?: string | null;
  appointmentType?: string | null;
  appointmentName?: string | null;
  bookingStatus?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  price?: number |string| null;
  createdBy?: any;
  email?:string;
  currency?: string | null;
  feeType?: string | null;
  notes?: string | null;
  categoryNote?: string | null;
  appointmentTimeStr?: string;
  appointmentDuration?: number;
  type?: string;
  reason?: string;
  timeStr?: string;
  appointmentNotes?: Record<string, any> | null; 
  appointmentMedia?: Record<string, any> | null; 
  workspaceId?: string;
  checkIn?: string | null;
  checkOut?: string | null;
  contactId?: string;
  meetingLink?: string;
  // appointmentNotes?: string;
}

export interface BookingReminder {
  id: number;
  created_at: string;
  bookingId: Booking;
  phone?: string | null;
  email?: string | null;
  smsMessage?: string | null;
  emailMessage?: string | null;
  smsStatus?: string | null;
  smsStatusMessage?: string | null;
  emailStatus?: string | null;
  emailStatusMessage?: string | null;
  recordCreationTimeStamp?: string | null;
  updatedAt?: string | null;
  lastUpdateTimestamp?: string | null;
  scheduledSendTime?: string | null;
  sendAt?: string | null;
  smscost?:string|null,
  smsLength?: number|null,
}

export interface UserType {
  id: bigint;
  created_at: string; // ISO 8601 date string
  userEmail: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  organization?: string | null;
  city?: string | null;
  country?: string | null;
  phoneNumber: string;
  whatsappNumber?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  x?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  referralCode?: string | null;
  referredBy?: string | null;
  workspaceRole?: string;
}

export interface User {
  id?: bigint;
  created_at?: Date;
  userEmail?: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  organization?: string | null;
  city?: string | null;
  country?: string | null;
  phoneNumber: string;
  whatsappNumber?: string | null;
  profilePicture?: string | null;
  bio?: string | null;
  x?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  referralCode?: string | null;
  referredBy?: string | null;
  workspaceRole?: string;
}

export interface AppointmentUnavailability {
  id?: bigint | number;
  created_at?: string; 
  createdBy?: number | null; 
  startDateTime?: string | null;
  endDateTime?: string | null;
  appointmentDate?:string|Date
}

export interface BookingsContact {
  id?: string; // uuid
  created_at?: string; // timestamp with time zone
  email?: string | null; // text
  phone?: string | null; // text
  whatsapp?: string | null; // text
  links?: {title:string, url:string}[] | null;  
  tags?: {tag:string,}[] | null; 
  firstName?: string | null; // text
  lastName?: string | null; // text
  createdBy?: number | null; // bigint
  age?: number;
  profileImg?: string;
  favourite?: boolean;
  workspaceId?: string;
}
export interface ContactTag {
  id?: number;  
  created_at?: string;  
  tag: string; 
  createdBy: number; 
}

export interface FormattedUnavailability {
  from: string; // Formatted start time (e.g., '09:00 AM')
  to: string; // Formatted end time (e.g., '10:00 AM')
  id: bigint | number; // Unavailability ID
  appointmentDate: string; // Formatted appointment date (e.g., 'Tue Oct 22 2024')
}
export interface UnavailabilityByDay {
  [dayString: string]: FormattedUnavailability[]; // Array of
}

export interface BookingsQuery {
  search?: string | null,
  status?: string | null,
  page?: number | null,
  type?: 'upcoming-appointments' | 'past-appointments' | null,
  date?: string | null,
  from?: string | null,
  to?: string | null,
  appointmentName?: string | null,
  teamMember?: string | null,
}

export interface AppointmentNotes {
  note: string,
  title: string,
  createdBy: any,
  createdAt?: string,
  updatedAt?: string,
  contactId?: bigint|number|string,
  media?: { url: string; type: string }[];
}

export interface BookingNote {
  id?: bigint;
  created_at?: string; // ISO timestamp
  bookingId?: bigint | null;
  title?: string | null;
  note?: string | null;
  createdBy?: User;
  lastEditDate?: string | null; // ISO timestamp
  media?: { type: string; url: string; }[] | null; // JSONB type
  workspaceId?: string | null;
  bookingContactId?: string | null;
}
