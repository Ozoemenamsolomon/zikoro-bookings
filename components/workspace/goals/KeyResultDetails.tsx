
import React, { Suspense } from 'react'

import { fetchKeyResultById, fetchMetricsByKeyResultId } from '@/lib/server/goals'
import MetricList from './MetricList'
import BackToGoalDetailsBtn from './BackToGoalDetailsBtn'
import EditKeyResultDetails from './EditKeyResultDetails'
import { Loader2, } from 'lucide-react'
import { urls } from '@/constants'
import { redirect } from 'next/navigation'
import MetricLineChart from './MetricLineChart'
import LineClampText from './LineClampText'

const KeyResultDetails = async({params}:{params:{workspaceAlias:string, keyResultId:string,contactId:string,goalId:string|number}}) => {
    const {goalId, contactId, keyResultId, workspaceAlias} = await params

    const {keyResult,error} = await fetchKeyResultById(keyResultId)
    
    if (!keyResult ) redirect(`/ws/${workspaceAlias}/${urls.contacts}/${contactId}`)
    const timelines = await fetchMetricsByKeyResultId(keyResult?.id!);

  return (
    <section className='bg-white '>
        <section className="bg-baseBg   py-6   sm:p-6   min-h-screen w-full space-y-6">
            
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <BackToGoalDetailsBtn goalId={keyResult?.goalId!}/>
                <h3 className="font-bold text-xl">Key Result</h3>
                <EditKeyResultDetails keyResult={keyResult!} />
            </header>

            <div className="px-4">
                <h6 className="font-bold">{keyResult?.keyResultTitle}</h6>
                <LineClampText text={keyResult?.description!} />
            </div>
            
            <div className="bg-baseBg text-center w-full border rounded-md p-6 max-sm:px-2">
                <Suspense
                    fallback={
                        <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-zikoroBlue" />
                        </div>
                    }
                >
                    <MetricLineChart timeLine={timelines} keyResult={keyResult}/>
                </Suspense>
            </div>
            <MetricList keyResult={keyResult!} timeLine={timelines}/>
        </section>
    </section>
  )
}

export default KeyResultDetails