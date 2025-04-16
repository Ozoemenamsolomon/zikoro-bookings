import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!  as string

export function createSecreteClient() {
    return createClient(
    supabaseUrl,
    serviceKey,
    {
      global: {
        fetch: (url: any, options = {}) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    }
  );
  }