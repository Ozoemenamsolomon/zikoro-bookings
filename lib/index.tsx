export * from "./utils";
export * from "./useClickOutside";
export * from "./client";
export * from "./client/bookingsAnalytics";
export * from "./client/bookingsCalender";
export * from "./settings";

export const getInitials = (firstName?: string|null, lastName?: string|null): string => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  