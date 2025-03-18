import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TUser } from "@/types/user";
import { Organization } from "@/types";
import { User } from "@/types/appointments";
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;

  workspaces: Organization[];
  setWorkSpaces: (workspaces: Organization[]) => void;

  currentWorkSpace: Organization | null;
  setCurrentWorkSpace: (workspace: Organization | null) => void;
}

// Zustand store
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),

      workspaces: [],
      setWorkSpaces: (workspaces: Organization[]) => set({ workspaces }),

      currentWorkSpace: null,
      setCurrentWorkSpace: (workspace: Organization | null) => set({ currentWorkSpace: workspace }),
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
  user: User | null,
  assignedWkspace?: Organization | null,
  isSignup?: boolean
): Promise<Organization | null> {
  const { setUser, setWorkSpaces, setCurrentWorkSpace, currentWorkSpace } = useUserStore.getState();
  // initializing user only during onboarding. Here workspaces and currentpworkspace are setup doing onboarding process
  setUser(user);

  // initializing login old user and not onboarding user.
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
      // set current workspace to current workspace from the session or to workspace from the token, which is the new workspace user was added to.
      if (assignedWkspace) {
        setCurrentWorkSpace(assignedWkspace);
        return assignedWkspace;
      } else if (currentWorkSpace) {
        // confirm the workspace from the session still exist in 
        const exists = data.find(
          (ws: Organization) => ws.organizationOwnerId === currentWorkSpace.organizationOwnerId
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
