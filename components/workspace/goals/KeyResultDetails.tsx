
import React from 'react'
import EditGoalBtn from './EditGoalBtn'
import BackToGoalsBtn from './BackToGoalsBtn'
import ProgressMetrics from './ProgressMetrics'
import { fetchKeyResultById } from '@/lib/server/goals'
import MetricList from './MetricList'
import BackToGoalDetailsBtn from './BackToGoalDetailsBtn'
import EditKeyResultDetails from './EditKeyResultDetails'
import KeyResultForm from './KeyResultForm'
import { PenLine } from 'lucide-react'

const KeyResultDetails = async({keyResultId}:{keyResultId:string}) => {
    const {keyResult,error} = await fetchKeyResultById(keyResultId)
  return (
    <section className='bg-white sm:p-3  overflow-auto'>
        <section className="bg-baseBg sm:border sm:rounded-md sm:p-3 py-6 min-h-screen w-full space-y-6">
            
            <header className="flex justify-between gap-3 pb-3 border-b w-full">
                <BackToGoalDetailsBtn goalId={keyResult?.goalId!}/>
                <h3 className="font-bold text-xl">Key Result - {keyResultId}</h3>
                <EditKeyResultDetails keyResult={keyResult!} />
            </header>

            <div className="px-4">
                <h6 className="font-bold">{keyResult?.keyResultTitle}</h6>
                <p className="text-sm">{keyResult?.description}</p>
            </div>
            <div className="border border-purple-200 rounded-md">
                <ProgressMetrics/>
            </div>

            <MetricList keyResult={keyResult!}/>
        </section>
    </section>
  )
}

export default KeyResultDetails