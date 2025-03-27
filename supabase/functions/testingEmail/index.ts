// // // Follow this setup guide to integrate the Deno language server with your editor:
// // // https://deno.land/manual/getting_started/setup_your_environment
// // // This enables autocomplete, go to definition, etc.

// // // Setup type definitions for built-in Supabase Runtime APIs
// // import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// // // @ts-ignore
// // import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";

// // // Initialize Supabase
// // // @ts-ignore
// // const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// // // @ts-ignore
// // const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// // // @ts-ignore
// // const zeptoApiKey = Deno.env.get("_ZEPTOMAIL_API_TOKEN") as string;
// // // @ts-ignore
// // const senderEmail = Deno.env.get("_SENDER_EMAIL") as string;

// // const supabase = createClient(supabaseUrl, supabaseKey);

// // function formatDateWithOffset(date: Date) {
// //   const offset = date.getTimezoneOffset();
// //   const sign = offset > 0 ? "-" : "+";
// //   const absOffset = Math.abs(offset);
// //   const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
// //   const minutes = String(absOffset % 60).padStart(2, "0");
// //   return date.toISOString().replace("Z", `${sign}${hours}:${minutes}`);
// // }

// // // @ts-ignore
// // Deno.serve(async (req) => {
// //   try {
// //     // const twoHoursAgo = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
// //     // const { data: users, error } = await supabase
// //     //   .from("organization")
// //     //   .select("id")
// //     //   .gte("created_at", new Date('Wed, 26 Feb 2025 11:36:48 GMT').toISOString())
// //     //   // .eq("welcome_email_sent", false);

// //     // if (error) throw error;

// //     // for (const user of users) {
// //     //   const mailBody = `
// //     //     <div style="background-color: #f4f4f4; padding: 20px;">
// //     //       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
// //     //         <tr><td align="center">
// //     //           <img src="https://res.cloudinary.com/dkdrbjfdt/image/upload/v1740654461/logo_rogdwe.webp" alt="Company Logo" width="150" style="margin-bottom: 20px;">
// //     //         </td></tr>
// //     //         <tr><td align="center">
// //     //           <div style="background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; text-align: start;">
// //     //             <p style="color: #555;">Hi ${user?.firstName},</p>
// //     //             <p style="color: #555; margin-top: 20px; margin-bottom: 20px;">
// //     //               We’re thrilled to have you on Zikoro! Here’s how you can get started right away:
// //     //             </p>
// //     //             <p>✅ Create and sell event/workshop tickets: <a href="https://zikoro.com">Get Started</a></p>
// //     //             <p>✅ Issue digital certificates: <a href="https://credentials.zikoro.com">Get Started</a></p>
// //     //             <p>✅ Simplify your appointments: <a href="https://bookings.zikoro.com">Get Started</a></p>
// //     //             <p>Want to optimize your business? 📲 WhatsApp us at <a href="https://wa.me/+2347041497076">+2347041497076</a>!</p>
// //     //             <p>Best Regards,</p>
// //     //             <p>The Zikoro Team</p>
// //     //           </div>
// //     //         </td></tr>
// //     //       </table>
// //     //     </div>`;

// //     //   const emailResponse = await fetch("https://api.zeptomail.com/v1.1/email", {
// //     //     method: "POST",
// //     //     headers: {
// //     //       "Content-Type": "application/json",
// //     //       Authorization: zeptoApiKey,
// //     //     },
// //     //     body: JSON.stringify({
// //     //       from: { address: senderEmail, name: "Zikoro" },
// //     //       to: [{ email_address: { address: user?.userEmail, name: user?.firstName } }],
// //     //       subject: "Welcome to Zikoro! Let’s Get Started 🚀",
// //     //       htmlbody: mailBody,
// //     //     }),
// //     //   });

// //       // if (!emailResponse.ok) {
// //       //   throw new Error(`Failed to send email: ${await emailResponse.text()}`);
// //       // }

// //       // await supabase.from("users").update({ welcome_email_sent: true }).eq("id", user.id);
// //     // }
// //     return new Response(
// //       JSON.stringify('users'),
// //       { headers: { "Content-Type": "application/json" } },
// //     )
// //     // return new Response(JSON.stringify(users), { status: 200 });
// //   } catch (error) {
// //     const errorMessage = error instanceof Error ? error.message : String(error); 
// //     console.error("Error in function:", errorMessage);
// //     return new Response(`Error: ${errorMessage}`, { status: 500 });  }
// // });


// // /* To invoke locally:
// //   1. Run supabase start (see: https://supabase.com/docs/reference/cli/supabase-start)
// //   2. Make an HTTP request:
// // curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/testingEmail' \
// //     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
// //     --header 'Content-Type: application/json' 
//     // --data '{"name":"Emma Udeji"}'
// // */



// // /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// // console.log("Hello from Functions!")

// // Deno.serve(async (req) => {
// //   const { name } = await req.json()
// //   const data = {
// //     message: `Hello ${name}!`,
// //   }

// //   return new Response(
// //     JSON.stringify(data),
// //     { headers: { "Content-Type": "application/json" } },
// //   )
// // })

// /// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;
// const supabase = createClient(supabaseUrl, supabaseKey);

// console.log("Hello from Functions!")

// Deno.serve(async (req) => {
//   const { name, g } = await req.json()
//   // const { data, error } = await supabase
//   //       .from('organization')
//   //       .select("*")
//   //       .eq("id":147)
//         // .gte("created_at", new Date('Wed, 26 Feb 2025 11:36:48 GMT').toISOString())
//   // console.log({ data, error })
//   const data = {
//     message: `Hello ${name + " " + g}!`,
//   }

//   return new Response(
//     JSON.stringify(data),
//     { headers: { "Content-Type": "application/json" } },
//   )
// })

// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.0";
// @ts-ignore
const supabaseUrl = Deno.env.get("_SUPABASE_URL") as string;
// @ts-ignore
const supabaseKey = Deno.env.get("_SUPABASE_SECRET_KEY") as string;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Hello from Functions!")
// @ts-ignore
Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})