# Zikoro Event Booking App: Calendar Management Documentation

This section provides an overview of how the **Calendar Management** functionality in the Zikoro Event Booking App is implemented. It is aimed at helping developers understand the codebase, focusing on data fetching, structure, and handling user interactions.

---

## Overview

The calendar feature in Zikoro allows users to view and manage events (bookings) and their unavailability dates. The functionality supports both **monthly** and **weekly** views, fetching data from Supabase tables for optimized performance and a smooth user experience.

---

## Data Fetching

### Bookings Data
- Bookings data is fetched from the **`bookings`** table.
- The function **`fetchCalendarData`** (path: `@/lib/server/calendar`) is responsible for fetching the data.
- The data is initially fetched using **Server-Side Rendering (SSR)** during page load.
- The following parameters are passed from `searchParams` to the function:
  - `workspaceId: string`
  - `date: Date | string`
  - `viewingType: 'month' | 'week'`
  - `userId?: string` (optional)

### Unavailability Data
- Unavailability dates are fetched from the **`appointmentUnavailability`** table alongside the bookings data.
- This represents the dates when the user has marked themselves as unavailable.
- Users can set or remove unavailability dates via the API.

---

## Data Fetching Interval

### Purpose
To strike a balance between minimizing server load and maintaining a responsive user experience.

### Interval Logic
- Data is fetched for a **4-month interval**, calculated as:
  - **2 months before today** and **2 months after today**.
- This interval prevents fetching all data at once (which could be voluminous) while reducing the frequency of data fetching when the user navigates to the next or previous month.

### Behavior on Interval
- When the user navigates beyond the pre-fetched 4-month range, the page refreshes, and new data is fetched.

---

## Viewing Types

The calendar supports two viewing types, with consistent data but varying UI:

### Monthly View
- Displays data grouped by days of the month.

### Weekly View
- Displays data for each day of the week, including:
  - Time of the appointments across a **24-hour timeline**.
  - Appointments are structured in **5-minute intervals**, ensuring precise positioning on the UI.

---

## Code Implementation Highlights

### `fetchCalendarData` Function
- **Path**: `@/lib/server/calendar`
- **Responsibility**:
  - Fetches bookings and unavailability data.
  - Accepts parameters to filter data by workspace, date, viewing type, and optional user ID.
- **Logic**:
  - Retrieves data for the specified 4-month range.
  - Populates the `appointmentLinkId` in the fetched bookings.

### Unavailability Management API
- Users can interact with the API to:
  - **Set** unavailability dates.
  - **Remove** unavailability dates.

---

## Optimization for User Experience
1. **Pre-fetched Interval**: Ensures a balance between data size and usability.
2. **Structured Viewing**:
   - Monthly and weekly views are designed to fit their respective use cases.
   - Weekly view offers precise time-based visualization of appointments.

---

## Considerations for Further Development
- Ensure efficient caching to minimize server load during repetitive data fetches.
- Optimize API calls for managing unavailability dates to reduce latency.
- Consider adding user feedback (e.g., loading indicators) for smooth transitions when fetching new data beyond the pre-fetched range.

---

This structure ensures that both functionality and user experience are prioritized in Zikoro’s event booking app calendar.
