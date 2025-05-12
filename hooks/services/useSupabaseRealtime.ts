// hooks/useSupabaseRealtime.ts
'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';

type Payload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: 'public';
  table: string;
  record: any   // new data
  old_record: any // old data (for updates/deletes)
};
type RealtimeType = {
  table: string, 
  onChange: (payload:Payload) => void,
  filter?:{filter:string},
}
export function useSupabaseRealtime(
 {table, onChange, filter}:RealtimeType
) {
    const supabase = createClient()
    useEffect(() => {
        const channel = supabase
        .channel(`realtime:${table}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
          console.log('Realtime payload:', payload);
          onChange(payload as any);
          }
      )
      .subscribe();

        return () => {
        supabase.removeChannel(channel);
        };
  }, [table, onChange]);
}
