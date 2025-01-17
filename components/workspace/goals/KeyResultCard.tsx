import { KeyResult } from '@/types/goal';
import React, { Suspense,  } from 'react';
import DropDownKeyResultAction from './DropDownKeyResultAction';
import { fetchMetricsByKeyResultId } from '@/lib/server/goals';
import MetricLineChart from './MetricLineChart';
import { Loader2 } from 'lucide-react';
import LineClampText from './LineClampText';

const KeyResultCard = async ({ keyResult }: { keyResult: KeyResult }) => {
  const timelines = await fetchMetricsByKeyResultId(keyResult?.id!);

  return (
    <div className="py-6 space-y-4 rounded-md border bg-white relative">
       <div className="pl-4 flex">
        <p className="text-zikoroBlue">{keyResult.status}</p>
       </div>

      <div className="pl-4 pr-1 text-center w-full">
        <Suspense
          fallback={
            <div className="py-20 flex justify-center">
              <Loader2 className="animate-spin text-zikoroBlue" />
            </div>
          }
        >
          <MetricLineChart timeLine={timelines} keyResult={keyResult} />
        </Suspense>
      </div>

      <div className="flex px-4 sm:justify-between sm:items-center gap-4 flex-col sm:flex-row">
        <div>
          <h6 className="font-bold">{keyResult?.keyResultTitle}</h6>
           <LineClampText text={keyResult?.description!} />
        </div>
      </div>
      <Suspense>
        <DropDownKeyResultAction keyResult={keyResult} />
      </Suspense>
    </div>
  );
};

export default KeyResultCard;
