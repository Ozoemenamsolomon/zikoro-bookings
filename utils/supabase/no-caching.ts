import { createClient } from '@supabase/supabase-js'
// import { unstable_noStore as noStore } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  as string
// export function createADMINClient() {
//     noStore();
//     return createClient(
//         supabaseUrl,
//         supabaseKey,
//         {
//             auth: {
//                 autoRefreshToken: false,
//                 persistSession: false,
//             },
//         }
//     );
// }

export function createADMINClient() {
    return createClient(
    supabaseUrl,
    supabaseKey,
    {
      global: {
        fetch: (url: any, options = {}) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    }
  );
}

// const supabase = createClient(
//     supabaseUrl,
//     supabaseKey,
//     {
//       global: {
//         fetch: (url: any, options = {}) => {
//           return fetch(url, { ...options, cache: 'no-store' });
//         }
//       }
//     }
//   )

// export const supabase = createADMINClient();

// export async function getAllEvents() {
//     const { data, error } = await supabase
//         .from('events')
//         .select()

//     if (error) {
//         console.error('Error fetching events:', error);
//     } else {
//         console.log('Fetched events:', data.length);
//     }

//     return data;
// }

