export interface Goal {
    id?: number; // bigint
    createdAt?: string; // ISO 8601 format for timestamp with time zone
    organization?: number | null; // bigint or null
    createdBy?: number | null; // bigint or null
    goalName?: string | null; // text or null
    description?: string | null; // text or null
    goalOwner?: number | null; // bigint or null
    goalOwnerName?: string | null; // text or null
    startDate?: string | null; // ISO 8601 date string or null
    endDate?: string | null; // ISO 8601 date string or null
    progress?: number | null; // numeric or null
    lastUpdated?: string | null; // ISO 8601 format for timestamp without time zone or null
  }
  export interface KeyResult {
    id?: number; // bigint
    createdAt?: string; // ISO 8601 format for timestamp with time zone
    organization?: number | null; // bigint or null
    createdBy?: number | null; // bigint or null
    goalId?: number | null; // bigint or null
    keyResultTitle?: string | null; // text or null
    description?: string | null; // text or null
    keyResultOwner?: number | null; // bigint or null
    startDate?: string | null; // ISO 8601 date string or null
    endDate?: string | null; // ISO 8601 date string or null
    measurementType?: string | null; // text or null
    currentValue?: number | null; // numeric or null
    targetValue?: number | null; // numeric or null
    unit?: string | null; // text or null
  }
  export interface KeyResultsTimeline {
    id?: number; // bigint
    createdAt?: string; // ISO 8601 format for timestamp with time zone
    organizationId?: number | null; // bigint or null
    keyResultId?: number | null; // bigint or null
    value?: number | null; // numeric or null
    createdBy?: number | null; // bigint or null
    note?: string | null; // text or null
    attachments?: Record<string, any> | null; // JSON object or null
  }
      