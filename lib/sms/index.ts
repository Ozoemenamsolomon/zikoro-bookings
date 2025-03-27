

import axios from 'axios';

export async function sendSms(recipients: string, message: string) {
  try {
    const url = `https://my.kudisms.net/api/sms?token=${process.env.KUDISMS_API_KEY}&senderID=${process.env.KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

    const data = new FormData();
    data.append("token", process.env.KUDISMS_API_KEY as string);
    data.append("senderID", process.env.KUDISMS_SENDER_ID as string);
    data.append("recipients", recipients);
    data.append("message", message);
    data.append("gateway", "2");

    const response = await fetch(url, {
      method: "POST",
      body: data, // ✅ Send FormData directly (no need for headers)
    });

    const responseData = await response.json();
    console.log({ responseData, data });

    return responseData;
  } catch (error: any) {
    console.error("SMS Sending Error:", error.message);
    throw new Error(error.message);
  }
}


// export async function sendSms(recipients: string, message: string) {
//   try {
//       const url = `https://my.kudisms.net/api/sms?token=${process.env.KUDISMS_API_KEY}&senderID=${process.env.KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

//     // const data = new URLSearchParams();
//     // data.append("token", KUDISMS_API_KEY as string);
//     // data.append("senderID", KUDISMS_SENDER_ID as string);
//     // data.append("recipients", recipients);
//     // data.append("message", message);
//     // data.append("gateway", "2");
//     const data = {
//       "token": process.env.KUDISMS_API_KEY as string,
//       "senderID": process.env.KUDISMS_SENDER_ID as string,
//       "recipients": recipients,
//       "message": message,
//       "gateway": "2"
//     }
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: data.toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to send SMS: ${response.statusText}`);
//     }

//     const dataa = await response.json();
//     console.log({ dataa, data, url });

//     return {dataa,data:data.toString()};
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }

// export async function sendSms(recipients: string, message: string) {
//     try {
 
//       const url = `https://my.kudisms.net/api/sms?token=${process.env.KUDISMS_API_KEY}&senderID=${process.env.KUDISMS_SENDER_ID}&recipients=${recipients}&message=${encodeURIComponent(message)}&gateway=2`;

//       const data = new FormData();
//             data.append("token", process.env.KUDISMS_API_KEY as string);
//             data.append("senderID", process.env.KUDISMS_SENDER_ID as string);
//             data.append("recipients", recipients);
//             data.append("message", message); 
//             data.append("gateway", "2");

//             const config = {
//                 method: 'post',
//                 maxBodyLength: Infinity,
//                 url,
//                 data : data
//               };
          
//           const response = await axios(config);
//           console.log({response})
//           return response.data;
  
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   }
  

  export async function submitSenderId(senderID: string, message: string) {
    try {
      const url = "https://kudisms.vtudomain.com/api/senderID";
  
      const formData = new FormData();
      formData.append("token", process.env.KUDISMS_API_KEY as string);
      formData.append("senderID", senderID);
      formData.append("message", message);
  
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit sender ID: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
//   import { NextResponse } from "next/server";
// import { submitSenderId } from "@/lib/submitSenderId";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { senderID, message } = body;

//     if (!senderID || !message) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const response = await submitSenderId(senderID, message);
//     return NextResponse.json(response);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// async function submitSender() {
//     const res = await fetch("/api/submit-sender", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         senderID: "Newsreel",
//         message: "Testing API sender ID",
//       }),
//     });
  
//     const data = await res.json();
//     console.log(data);
//   }
  

export async function checkSenderId(senderID: string) {
    try {
      const url = `https://kudisms.vtudomain.com/api/check_senderID?token=${process.env.KUDISMS_API_KEY}&senderID=${senderID}`;
     
      const data = new FormData();
      data.append('token', process.env.KUDISMS_API_KEY!);
      data.append('senderID', senderID);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body:data
      });
  
      if (!response.ok) {
        throw new Error(`Failed to check sender ID: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

//   import { NextResponse } from "next/server";
// import { checkSenderId } from "@/lib/checkSenderId";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const senderID = searchParams.get("senderID");

//     if (!senderID) {
//       return NextResponse.json({ error: "Missing senderID parameter" }, { status: 400 });
//     }

//     const response = await checkSenderId(senderID);
//     return NextResponse.json(response);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// async function checkSender() {
//     const senderID = "neo"; // Example sender ID
//     const res = await fetch(`/api/check-sender?senderID=${senderID}`, {
//       method: "GET",
//     });
  
//     const data = await res.json();
//     console.log(data);
//   }
  