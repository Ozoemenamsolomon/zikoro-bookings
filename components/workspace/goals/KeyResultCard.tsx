import { KeyResult } from '@/types/goal'
import React, { Suspense } from 'react'
import DropDownKeyResultAction from './DropDownKeyResultAction'
import { fetchMetricsByKeyResultId } from '@/lib/server/goals';
import MetricLineChart from './MetricLineChart';
import { Loader2 } from 'lucide-react';
import { CenterModal } from '@/components/shared/CenterModal';
import UpdateKeyResultStatus from './UpdateKeyResultStatus';

const KeyResultCard = async ({keyResult}:{keyResult:KeyResult}) => {
    const timelines = await fetchMetricsByKeyResultId(keyResult?.id!);
    
  return (
        <div className="p-2 pb-5 space-y-2 rounded-md border bg-white relative">
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

            <div className="flex px-4 justify-between items-center gap-4 flex-col sm:flex-row">
                <div className="">
                    <h6 className="font-bold">{keyResult?.keyResultTitle}</h6>
                    <p className="text-sm">{keyResult?.description}</p>
                </div>
                <UpdateKeyResultStatus keyResult={keyResult}/>
            </div>
            <Suspense>
                <DropDownKeyResultAction keyResult={keyResult}/>
            </Suspense>
        </div>
  )
}

export default KeyResultCard