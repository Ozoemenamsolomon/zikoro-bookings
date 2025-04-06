import { NextResponse } from "next/server";
import { sendSms } from "@/lib/bookingReminders"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    console.log('SMS REMIDER LOG: ', body)
    
    const bookingReminder = searchParams.get('bookingReminder')!;  
    const { recipients, message } = body;

    if (!recipients || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await sendSms(recipients, message);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
