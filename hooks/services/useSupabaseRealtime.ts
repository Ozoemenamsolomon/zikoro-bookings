// hooks/useSupabaseRealtime.ts
'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';

export function useSupabaseRealtime<T>(
  table: string,
  onChange: (payload: T) => void
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
