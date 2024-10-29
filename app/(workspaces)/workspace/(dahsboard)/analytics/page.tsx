import Analytics from '@/components/workspace/Analytics'
import React from 'react'

const AnalyticsPage = ({searchParams:{type}}:{
    searchParams:{type?:string}
}) => {
  return (
    <Analytics type={type} />
  )
}

export default AnalyticsPage