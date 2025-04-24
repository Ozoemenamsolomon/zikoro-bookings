import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Organization, SubscriptionPlanInfo } from "@/types";
import { User } from "@/types/appointments";
import { getPermissionsFromSubscription } from "@/lib/server/subscriptions";
import { createWorkspaceFromScratch } from "@/lib/server/workspace";
 
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;

  workspaces: Organization[];
  setWorkSpaces: (workspaces: Organization[]) => void;

  currentWorkSpace: Organization | null;
  setCurrentWorkSpace: (workspace: Organization | null) => void;

  currencies: { label: string; value: string }[];
  setCurrencies: (currencies: { label: string; value: string }[]) => void;

  subscriptionPlan: SubscriptionPlanInfo | null;
  setSubscritionPlan: (subscriptionStatus: SubscriptionPlanInfo | null) => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      workspaces: [],
      setWorkSpaces: (workspaces) => set({ workspaces }),

      currentWorkSpace: null,
      setCurrentWorkSpace: (workspace) => set({ currentWorkSpace: workspace }),

      currencies: [],
      setCurrencies: (currencies) => set({ currencies }),

      subscriptionPlan: null,
      setSubscritionPlan: (subscriptionStatus) => set({ subscriptionPlan: subscriptionStatus }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;

// Outside Zustand: Async Logic
export async function initializeWorkspaces(
  user: User | null,
  assignedWkspace?: Organization | null,
  isSignup?: boolean
): Promise<Organization | null> {
  const {
    setUser,
    setWorkSpaces,currentWorkSpace,
    setCurrentWorkSpace,
    setSubscritionPlan,
  } = useUserStore.getState();

  setUser(user);

  if (user && !isSignup) {
    try {
      const response = await fetch(`/api/workspaces?userId=${user.id}`);
      const { data, error } = await response.json();
      console.log({data,error})

      // edge case for fallback to user without workspace.
      if(!data){
        const {data} = await createWorkspaceFromScratch(user)
        setWorkSpaces([data]);
        setCurrentWorkSpace(data);
        return data;
      }

      // if (error) {
      //   console.error("Error fetching workspaces:", error);
      //   setWorkSpaces([]);
      //   setCurrentWorkSpace(null);
      //   return null;
      // }

      setWorkSpaces(data);

      const pickWorkspace = (
        preferred: Organization | null,
        fallback: Organization[]
      ): Organization | null => {
        if (preferred) return preferred;
        return fallback[0] || null;
      };

      let selectedWorkspace = pickWorkspace(assignedWkspace!, data);

      if (!selectedWorkspace) {
        const {data} = await createWorkspaceFromScratch(user)
        setWorkSpaces([data]);
        setCurrentWorkSpace(data);
        return data;
      }

      // const { plan, updatedWorkspace } = await getPermissionsFromSubscription(
      //   selectedWorkspace
      // );
      // setSubscritionPlan(plan);

      // if (updatedWorkspace) {
      //   selectedWorkspace = updatedWorkspace;
      //   const updatedWorkspaces = data.map((item: Organization) =>
      //     item.id === updatedWorkspace.id ? updatedWorkspace : item
      //   );
      //   setWorkSpaces(updatedWorkspaces);
      // }

      setCurrentWorkSpace(selectedWorkspace);

      return selectedWorkspace;
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
      setWorkSpaces([]);
      setCurrentWorkSpace(null);
      return null;
    }
  }

  return null;
}

