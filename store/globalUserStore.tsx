import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TUser } from "@/types/user";
import { BookingWorkSpace } from "@/types";
interface UserState {
  user: TUser | null;
  setUser: (user: TUser | null) => void;

  workspaces: BookingWorkSpace[];
  setWorkSpaces: (workspaces: BookingWorkSpace[]) => void;

  currentWorkSpace: BookingWorkSpace | null;
  setCurrentWorkSpace: (workspace: BookingWorkSpace | null) => void;
}

// Zustand store
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: TUser | null) => set({ user }),

      workspaces: [],
      setWorkSpaces: (workspaces: BookingWorkSpace[]) => set({ workspaces }),

      currentWorkSpace: null,
      setCurrentWorkSpace: (workspace: BookingWorkSpace | null) => set({ currentWorkSpace: workspace }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useUserStore

// Outside Zustand: Async Logic
export async function initializeWorkspaces(
  user: TUser | null,
  assignedWkspace?: BookingWorkSpace | null,
  isSignup?: boolean
): Promise<BookingWorkSpace | null> {
  const { setUser, setWorkSpaces, setCurrentWorkSpace, currentWorkSpace } = useUserStore.getState();

  setUser(user);

  if (user && !isSignup) {
    try {
      const response = await fetch(`/api/workspaces?userId=${user.id}`);
      const { data, error } = await response.json();

      if (error) {
        console.error('Error fetching workspaces:', error);
        setWorkSpaces([]);
        setCurrentWorkSpace(null);
        return null;
      }

      setWorkSpaces(data);

      if (assignedWkspace) {
        setCurrentWorkSpace(assignedWkspace);
        return assignedWkspace;
      } else if (currentWorkSpace) {
        const exists = data.find(
          (ws: BookingWorkSpace) => ws.workspaceOwner === currentWorkSpace.workspaceOwner
        );
        setCurrentWorkSpace(exists || data[0] || null);
        return exists || data[0] || null;
      } else {
        setCurrentWorkSpace(data[0] || null);
        return data[0] || null;
      }
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      setWorkSpaces([]);
      setCurrentWorkSpace(null);
      return null;
    }
  }

  return null;
}
