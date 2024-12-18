import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
    const supabase = createClient()
    const {goalData,keyResultData} = await req.json()
    console.log({goalData,keyResultData,} )
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert(goalData)
        .select()
        .single()
        
      if(error) {
        console.error("Error inserting GOALS:", error.message);
        return NextResponse.json({ data:null, error:error.message }, { status: 200 });
      }

      const validateKeyResult= () => {
        const newErrors: { [key: string]: string | null } = {}
        if (!keyResultData.keyResultTitle) newErrors.keyResultTitle = 'Key result title is required.'
        if (!keyResultData.startDate) newErrors.startDate = 'Start date is required.'
        if (!keyResultData.endDate) newErrors.endDate = 'End date is required.'
        if (!keyResultData.unit) newErrors.unit = 'The Unit of measurement is required.'
        if (!keyResultData.targetValue) newErrors.targetValue = 'Target value is required.'
        if (!keyResultData.currentValue) newErrors.currentValue = 'Start value is required.'
        if (keyResultData.startDate && keyResultData.endDate && new Date(keyResultData.startDate) > new Date(keyResultData.endDate)) {
            newErrors.endDate = 'End date must be after start date.';
          }
        return Object.values(newErrors).every(error => !error)
      }
      if(validateKeyResult()) {
          const { data:keyResult, error:keyResultErr } = await supabase
          .from('keyResults')
          .insert({...keyResultData, goalId:data.id})
          .select()
          .single()
          
    console.log('keyResult CREATED:', {keyResult})
          
          if(keyResultErr) {
            console.error("Error inserting KEYRESULT:", keyResultErr.message);
            return NextResponse.json({ data:null, error:keyResultErr.message }, { status: 200 });
          }
      }

    console.log('GOAL CREATED:', {data})
    return NextResponse.json({ data, error}, { status: 200 });
    } catch (error) {
        console.error("Unhandled error in GOAL API:", error);
        return NextResponse.json(
          { error: "An error occurred while processing the request" },
          { status: 500 }
        );
    }
}