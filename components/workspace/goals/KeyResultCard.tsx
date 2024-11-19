import { KeyResult } from '@/types/goal'
import React, { Suspense } from 'react'
import DropDownKeyResultAction from './DropDownKeyResultAction'

const KeyResultCard = ({keyResult}:{keyResult:KeyResult}) => {
  return (
        <div className="p-2 pb-5 space-y-2 rounded-md border bg-white relative">
            <div className="bg-baseBg text-center w-full border rounded-md p-2 py-20">
                metric
            </div>

            <div className="px-4">
                <h6 className="font-bold">{keyResult?.keyResultTitle}</h6>
                <p className="text-sm">{keyResult?.description}</p>
            </div>
            <Suspense>
                <DropDownKeyResultAction keyId={keyResult?.id!}/>
            </Suspense>
        </div>
  )
}

export default KeyResultCard