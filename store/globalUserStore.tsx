import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TUser } from "@/types/user";
import { BookingWorkSpace } from "@/types";

// Define the user state interface
interface UserState {
  user: TUser | null;
  setUser: (user: TUser | null) => void;

  workspaces: BookingWorkSpace[];
  setWorkSpaces: (workspaces: BookingWorkSpace[]) => void;

  currentWorkSpace: BookingWorkSpace | null;
  setCurrentWorkSpace: (workspace: BookingWorkSpace | null) => void;
}

// Create the user store
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: async (user: TUser | null) => {
        set({ user });
        
        if (user) {
          try {
            const response = await fetch(`/api/workspaces?userId=${user.id}`);
            
            const { data, error } = await response.json();

            if (error) {
              console.error('Error fetching workspaces:', error);
              set({ workspaces: [] });
              set({ currentWorkSpace: null });
              return;
            }

            set({ workspaces: data });

            // Check for persisted current workspace
            const persistedWorkspace = get().currentWorkSpace;
            if (persistedWorkspace) {
              const exists = data.find(
                (ws:BookingWorkSpace) => ws.workspaceOwner === persistedWorkspace.workspaceOwner
              );
              set({ currentWorkSpace: exists || data[0] || null });
            } else {
              set({ currentWorkSpace: data[0] || null });
            }
          } catch (error) {
            console.error('Failed to fetch workspaces:', error);
            set({ workspaces: [] });
            set({ currentWorkSpace: null });
          }
        }
      },

      workspaces: [],
      setWorkSpaces: (workspaces: BookingWorkSpace[]) => set({ workspaces }),

      currentWorkSpace: null,
      setCurrentWorkSpace: (workspace: BookingWorkSpace | null) => set({ currentWorkSpace: workspace }),
    }),
    {
      name: "user-store", // Persisted storage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
