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
- **Workspace Role Management**: Roles like `ADMIN` and `MEMBER` define user permissions.
- **Scheduling and Booking**: Tools specific to the active workspace.
- **Cross-Workspace Support**: Users can seamlessly switch between workspaces.

---

## **3. Core Workflows**

### **3.1 User Onboarding**
1. User signs up and confirms their email.
2. A default workspace (`My Workspace`) is created or named after an optional organization name provided during onboarding.
3. The user is redirected to `/ws/[workspaceId]` to access the workspace.
4. If `[workspaceId]` is invalid, then redirects to an error handling page at `/ws`.

### **3.2 Inviting Team Members**
1. From `/ws/[workspaceId]/settings/teams`, users invite team members.
2. An email containing a **JWT token** with:
   - `email`
   - `workspaceId`
   - `role` (default: `MEMBER`)
   - Expiration: 5 days
3. Token details are stored in the `teams` table:
   - `email`
   - `workspaceId`
   - `role` = `MEMBER`
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
2. The creator is added to the `teams` table as `ADMIN`.
3. `currentWorkspace` and `workspaces` in the user store are updated.

---

## **4. Optimization Strategies**

### **4.1 Concurrent Email and Database Operations**
- **Problem**: Sending emails and database operations sequentially increase latency.
- **Solution**:
  - Use **Edge Functions** (e.g., Vercel Functions) or background workers to handle email sending and database updates concurrently.
  - Example:
    ```typescript
    async function handleInvitation(invitationDetails) {
      const emailPromise = sendEmail(invitationDetails.email, invitationDetails.jwt);
      const dbPromise = insertTeamMember(invitationDetails);
      await Promise.all([emailPromise, dbPromise]);
    }
    ```

### **4.2 Token Validation and Security**
- Ensure tokens are short-lived (e.g., 5 days) and validate securely on the server.
- Include additional claims in the token (e.g., issued time, issuer) for added security.

### **4.3 Efficient Data Fetching**
- Use batching to fetch all workspaces and team details in a single query.
- Example:
  ```sql
  SELECT * FROM workspaces 
  WHERE id IN (SELECT workspaceId FROM teams WHERE userId = ?);
  ```

### **4.4 Workspace Switching Optimization**
- Use `zustand` or similar state management libraries for efficient state updates.
- Maintain `currentWorkspace` globally to reduce redundant fetches.

### **4.5 Email Queueing**
- Use a service like AWS SES, Postmark, or SendGrid with a queuing mechanism (e.g., RabbitMQ, Redis).
- Retry failed email sends to ensure delivery.

---

## **5. Scaling Considerations**

1. **Database Design**:
   - Normalize tables to reduce redundancy.
   - Use indexed columns (`workspaceId`, `email`) for faster lookups.
2. **Load Balancing**:
   - Distribute workloads using a CDN and load balancers.
3. **Asynchronous Processing**:
   - Use job queues to offload tasks like email sending or report generation.
4. **Microservices Architecture**:
   - Separate services for user management, workspace handling, and email notifications for better scalability.

---

## **6. Algorithm for User Invitation**
```typescript
async function inviteTeamMember(email: string, workspaceId: string, role: string = 'MEMBER') {
  const token = generateJWT({ email, workspaceId, role, exp: Date.now() + 5 * 24 * 60 * 60 * 1000 });

  const dbOperation = insertIntoTeamsTable(email, workspaceId, role, 'PENDING');
  const emailOperation = sendInvitationEmail(email, token);

  // Run both tasks concurrently
  try {
    await Promise.all([dbOperation, emailOperation]);
  } catch (error) {
    console.error('Failed to invite team member:', error);
    throw error;
  }
}
```

#### Contacts

---

## **7. Tools and Libraries**
- **State Management**: `zustand` for global workspace state.
- **Database**: PostgreSQL or MySQL with Prisma for ORM.
- **Email Services**: AWS SES, Postmark, or SendGrid.
- **Edge Functions**: Vercel, AWS Lambda for concurrent processing.
