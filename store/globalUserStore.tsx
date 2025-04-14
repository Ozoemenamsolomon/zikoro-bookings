import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Organization, SubscriptionPlanInfo } from "@/types";
import { User } from "@/types/appointments";
import { getPermissionsFromSubscription } from "@/lib/server/subscriptions";
 
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

      if (error) {
        console.error("Error fetching workspaces:", error);
        setWorkSpaces([]);
        setCurrentWorkSpace(null);
        return null;
      }

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
        setCurrentWorkSpace(null);
        return null;
      }

      const { plan, updatedWorkspace } = await getPermissionsFromSubscription(
        selectedWorkspace
      );
      setSubscritionPlan(plan);

      if (updatedWorkspace) {
        selectedWorkspace = updatedWorkspace;
        const updatedWorkspaces = data.map((item: Organization) =>
          item.id === updatedWorkspace.id ? updatedWorkspace : item
        );
        setWorkSpaces(updatedWorkspaces);
      }

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




// export async function initializeWorkspaces(
//   user: User | null,
//   assignedWkspace?: Organization | null,
//   isSignup?: boolean
// ): Promise<Organization | null> {
//   const { setUser, setWorkSpaces, setCurrentWorkSpace, currentWorkSpace, setSubscritionPlan } = useUserStore.getState();
//   // initializing user only during onboarding. Here workspaces and currentpworkspace are setup doing onboarding process
//   setUser(user);

//   // initializing login old user and not onboarding user.
//   if (user && !isSignup) {
//     try {
//       const response = await fetch(`/api/workspaces?userId=${user.id}`);
//       const { data, error } = await response.json();

//       if (error) {
//         console.error('Error fetching workspaces:', error);
//         setWorkSpaces([]);
//         setCurrentWorkSpace(null);
//         return null;
//       }

//       setWorkSpaces(data);
//       // set current workspace to current workspace from the session or to workspace from the token, which is the new workspace user was added to.
//       if (assignedWkspace) {
//         setCurrentWorkSpace(assignedWkspace);
//         const {plan, updatedWorkspace} = await getPermissionsFromSubscription(assignedWkspace)
//         setSubscritionPlan(plan)
//         if(updatedWorkspace){
//           setCurrentWorkSpace(updatedWorkspace)
//           const updatedWorkspaces = data.map((item:Organization) =>
//             item.id === updatedWorkspace.id ? updatedWorkspace : item
//           );
//           setWorkSpaces(updatedWorkspaces);
//         }

//         return updatedWorkspace||assignedWkspace;
//       } else if (currentWorkSpace) {
//         // confirm the workspace from the session still exist in 
//         const exists = data.find(
//           (ws: Organization) => ws.organizationOwnerId === currentWorkSpace.organizationOwnerId
//         );
//         setCurrentWorkSpace(exists || data[0] || null);
//         if (exists||data[0]) {
//           const {plan, updatedWorkspace} = await getPermissionsFromSubscription(exists||data[0])
//           setSubscritionPlan(plan)
//           if(updatedWorkspace){
//             setCurrentWorkSpace(updatedWorkspace)
//             const updatedWorkspaces = data.map((item:Organization) =>
//               item.id === updatedWorkspace.id ? updatedWorkspace : item
//             );
//             setWorkSpaces(updatedWorkspaces);
//           }

//           return updatedWorkspace||exists||data[0]||null;
//         }
//         return exists || data[0] || null;
//       } else {
//         setCurrentWorkSpace(data[0] || null);
//         if (data[0]) {
//           const {plan, updatedWorkspace} = await getPermissionsFromSubscription(data[0])
//           setSubscritionPlan(plan)
//           if(updatedWorkspace){
//             setCurrentWorkSpace(updatedWorkspace)
//             const updatedWorkspaces = data.map((item:Organization) =>
//               item.id === updatedWorkspace.id ? updatedWorkspace : item
//             );
//             setWorkSpaces(updatedWorkspaces);
//           }

//           return updatedWorkspace||data[0]||null;
//         }
//         return data[0] || null;
//       }

//     } catch (error) {
//       console.error('Failed to fetch workspaces:', error);
//       setWorkSpaces([]);
//       setCurrentWorkSpace(null);
//       return null;
//     }
//   }

//   return null;
// }

 