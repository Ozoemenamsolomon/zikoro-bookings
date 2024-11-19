import Loading from '@/components/shared/Loader'
import { CirclePointer } from '@/constants'
import React, { Suspense } from 'react'
import KeyResultCard from './KeyResultCard'
import { fetchKeyResultsByGoalId } from '@/lib/server/goals'

const KeyResultList = async ({goalId}:{goalId:string}) => {
    const {keyResults, error} = await fetchKeyResultsByGoalId(goalId)
  return (
    <section className='space-y-4 '>
        <div className="flex gap-2 items-center w-full">
            <div className="shrink-0">
                <CirclePointer/>
            </div>
            <div className="flex-1 min-w-0 truncate">
                <h5 className="font-bold text-lg">Key results</h5>
                <p className="text-sm">Targets and objectives assigned to this goal</p>
            </div>
        </div>

        <Suspense fallback={<div className='py-20 flex justify-center w-full'><Loading/></div>}>
            <div className="space-y-4">
                {
                    error ? 
                    <div className="py-20 text-center w-full">{error}</div>
                    :
                    keyResults?.map((keyResult,idx)=>{
                        return (
                            <KeyResultCard keyResult={keyResult} key={idx}/>
                        )
                    })
                }
            </div>
        </Suspense>
    </section>
  )
}

export default KeyResultList