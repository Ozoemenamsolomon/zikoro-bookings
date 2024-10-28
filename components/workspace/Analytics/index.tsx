import React, { Suspense } from 'react'

import SectionOne from './SectionOne'
import { fetchAnalytics } from '@/lib/server/analytics'
import LoadingState from './LoadingState'
import SectionTwo from './SectionTwo'
import SectionThree from './SectionThree'
import SectionFive from './SectionFive'
import SectionFour from './SectionFour'

const Analytics = async ({type}:{type?:string}) => {
  const { curList, prevList, } = await fetchAnalytics({type})
  return (
    <div className='py-8 space-y-8'>
        <section className="grid xl:grid-cols-2 gap-8    ">

          <Suspense fallback={
            <section className="grid xs:grid-cols-2 md:grid-cols-3  gap-4 xl:grid-cols-2">
              {
                [...Array(6).map((_,idx)=><LoadingState key={idx}/>)]
              }
            </section>
          }> 
            <SectionOne curList={curList} prevList={prevList} typeParam={type}/>
          </Suspense>

          <Suspense fallback={
            <section className="grid md:grid-cols-2 xl:grid-cols-1  gap-4">
              {
                [...Array(3).map((_,idx)=><LoadingState key={idx}/>)]
              }
            </section>
          }> 
            <SectionTwo curList={curList} prevList={prevList} typeParam={type}/>
          </Suspense>
        </section>

        <Suspense fallback={
          <section className='h-96 p-12 rounded-lg'><LoadingState/></section>
        }>
          <SectionThree  curList={curList} prevList={prevList} typeParam={type}/>
        </Suspense>
        <Suspense fallback={
          <section className='h-96 p-12 rounded-lg'><LoadingState/></section>
        }>
          <SectionFive curList={curList} prevList={prevList} typeParam={type}/>
       </Suspense>
        <Suspense fallback={
          <section className='h-96 p-12 rounded-lg'><LoadingState/></section>
        }>
          <SectionFour curList={curList} prevList={prevList} typeParam={type}/>
       </Suspense>

    </div>
  )
}

export default Analytics