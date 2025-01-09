import React, { Suspense } from 'react'

import SectionOne from './SectionOne'
import LoadingState from './LoadingState'
import SectionTwo from './SectionTwo'
import SectionThree from './SectionThree'
import SectionFive from './SectionFive'
import SectionFour from './SectionFour'
import AnalyticsWrapper from './AnalyticsWrapper'

const Analytics = async () => {
  return (
    <AnalyticsWrapper>
      <div className='pb-8 space-y-8'>
          <section className="grid xl:grid-cols-2 gap-8    ">

            <Suspense fallback={
              <section className="grid xs:grid-cols-2 md:grid-cols-3  gap-4 xl:grid-cols-2">
                {
                  [...Array(6).map((_,idx)=><LoadingState key={idx}/>)]
                }
              </section>
            }> 
              <SectionOne  />
            </Suspense>

            <Suspense fallback={
              <section className="grid md:grid-cols-2 xl:grid-cols-1  gap-4">
                {
                  [...Array(3).map((_,idx)=><LoadingState key={idx}/>)]
                }
              </section>
            }> 
              <SectionTwo />
            </Suspense>
          </section>

          <Suspense fallback={
            <section className='h-96 p-12 rounded-lg'><LoadingState/></section>
          }>
            <SectionThree />
          </Suspense>
          <Suspense fallback={
            <section className='h-96 p-12 rounded-lg'><LoadingState/></section>
          }>
              <SectionFive />
          </Suspense>
          <Suspense fallback={
            <section className='h-96 p-12 rounded-lg'><LoadingState/></section>
          }>
            <SectionFour />
        </Suspense>

      </div>
    </AnalyticsWrapper>
  )
}

export default Analytics