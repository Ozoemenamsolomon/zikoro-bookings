# Zikoro Scheduling and Booking app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## **1. Overview**
Zikoro is an event scheduling and booking application designed to facilitate user onboarding, workspace management, team collaboration, and workspace-specific features like scheduling, booking, analytics, and contact management. The application operates on a **workspace-based model**, ensuring organized and compartmentalized user interactions.

---

## **2. Key Features**
- **User Onboarding**: New users sign up, confirm their email, and complete onboarding.
- **Workspaces**: Users are assigned to a default workspace or can create custom ones.
- **Team Management**: Users can invite others to join their workspace teams.
- **Workspace Role Management**: Roles like `onwer`, `colaborator`  and `editor` define user permissions.
- **Scheduling and Booking**: Tools specific to the active workspace.
- **Workspace Subscription Plan Management**: Permissions granted based on subscriptions.
- **Cross-Workspace Support**: Users can seamlessly switch between workspaces.

---

## **3. Core Workflows**

### **3.1 User Onboarding**
1. User signs up and confirms their email.
2. A default workspace (`My Workspace`) is created or named after an optional organization name provided during onboarding.
3. The user is redirected to `/ws/[workspaceAlias]` to access the workspace.
4. If `[workspaceAlias]` is invalid, then create a new `Free` workspace called `Beta Workspace` or redirects to an error handling page at `/ws`.

### **3.2 Inviting Team Members**
1. From `/ws/[workspaceId]/settings/teams`, users invite team members.
2. An email containing a **JWT token** with:
   - `email`
   - `workspaceId`
   - `role` (default: `editor`)
   - Expiration: 5 days
3. Token details are stored in the `teams` table:
   - `email`
   - `workspaceId`
   - `role` = `editor` or `colaborator`
   - `status` = `PENDING`

### **3.3 Workspace Management on Login**
1. **Existing Members**:
   - If invited users are already registered, they log in, and:
     - All their workspaces are fetched.
     - `currentWorkspace` is set to the workspace in the token.
     - `status` in the `teams` table is updated to `ACTIVE`.
   - They can switch workspaces if necessary.
2. **New Users**:
   - If the invited user is not registered, they sign up and verify their email.
   - During onboarding:
     - `status` in the `teams` table for the token workspace is updated to `ACTIVE`.
     - `currentWorkspace` is set to the workspace in the token.

### **3.4 Creating a Workspace**
1. A new workspace is created in the `workspaces` table.
2. The creator is added to the `teams` tables as `owner`.
3. `currentWorkspace` and `workspaces` in the user store are updated.

---

### **4. Securing Workspaces**
Workspace Access Protection
We safeguard workspace access by verifying both the user’s role and the workspace’s subscription plan, ensuring only authorized users can enter a workspace.

How It Works:
We protect the dynamic workspace pages from the nearest layout.tsx

 
- The system first confirms the user is logged in. (optional)
- If not, they’re redirected to the login page.


Team Membership Validation
- The system checks if the user is still a team member of the workspace.
  This covers scenarios where a user might have been removed from a workspace without their knowledge.
- If the user is no longer a team member, they’re redirected to one of their own workspaces with a clear popover message explaining why.

Subscription Plan & Role Check
- Only owners are allowed access to workspaces on the Free or Lite plans since these plans don’t support team members.- 
- If the workspace is on a Free or Lite plan and the user is not the owner, access is denied.
- The user is redirected to one of their own workspaces with a message.

Grant Access
- If all checks pass, the user is granted access, and the workspace page loads as expected.

Further protection from the front end
   the currentworkspace and workspaces are stored in the store
   a check is applied in the dashboard layout, this could also be plced in the global context
   it checks subscription permissions whenever pathname is alterd. this can be improved by listening to events in the database table
   it uses the workspaceAlias from the params and fetches current workspace and other workspaces the user belongs to.
   ite then updates the store.
   then a subscriptionPlan check is constructed with function to return the necessary permisios which is used to control what user can do while in the Ui. 