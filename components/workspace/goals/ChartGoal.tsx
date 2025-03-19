'use client'

import React, { useState, useEffect } from "react"
import { Goal, KeyResult } from "@/types/goal"
import { Loader2 } from "lucide-react"
import {
  RadialBar,
  RadialBarChart,
  PolarGrid,
  PolarRadiusAxis,
  Label,
} from "recharts"
 
import { ChartContainer } from "@/components/ui/chart"

const ChartGoal = ({goal}:{goal:Goal}) => {
    // loading, error, keyresult completed list states
    // 
    // fetch keyresults with goalId and structure chart:
    // from fetched keyresults count keyresults with status completed,
    //  if status is not completed and is not archived, check if the endate is expired that is greater than today, and if the currentvalue is greater or equal to target value and add it to the count for completed ...
    // design a circle doughnut chart or that shows percentage completd against the toatal count of the keyresults ...

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [chartData, setChartData] = useState<{ percentage: number; label: string } | null>(null)
  
    useEffect(() => {
      const fetchKeyResults = async () => {
        try {
          const response = await fetch(`/api/goals/fetchKeyresults?goalId=${goal.id}`)
           const {data:keyResults,count,error }:{data:KeyResult[],count:number,error:string|null} = await response.json()

          // Calculate completed key results
          const totalKeyResults = keyResults.length
          const completedKeyResults = keyResults.filter((kr) => {

            const isCompleted = kr.status === "Completed"
            // const isOverdueCompleted =
            //   kr.status !== "Archived" && kr.status !== "Completed" &&
            //   new Date(kr.endDate!) > new Date() &&
            //   kr.currentValue! >= kr.targetValue!
              // consider
            return isCompleted  
          }).length
  
          const percentage = totalKeyResults > 0 ? Math.round((completedKeyResults / totalKeyResults) * 100) : 0
          // console.log({completedKeyResults,count,percentage, totalKeyResults,})
          setChartData({ percentage, label: `${percentage}% Completed` })
          setError(null)
        } catch (err) {
          setError("Failed to fetch key results.")
        } finally {
          setLoading(false)
        }
      }
  
      fetchKeyResults()
    }, [goal])
    // console.log({chartData})
  return (
    <div className="  w-full  ">
    {
    loading ?
        <div className="py-20 flex justify-center">
          <Loader2 className='animate-spin' />
        </div>
        :
    error ? (
        <div className="py-20 flex justify-center text-sm text-center">
          <p>Error: {error}</p>
        </div>
      ) : !chartData ? (
        <div className="py-20 flex justify-center text-sm text-center">
          <p>No data available for this chart.</p>
        </div>
      ) : (
        <ChartContainer config={{}} className="w-full max-w-[28rem] mx-auto h-48">
          <RadialBarChart
            data={[
              { name: "Completed", value: chartData.percentage, fill: "hsl(var(--zblue))" },
            ]}
            startAngle={90}
            endAngle={90 + (chartData.percentage / 100) * 360}
            width={250}
            height={250}
            innerRadius={80}
            outerRadius={90}
          >
            <PolarGrid gridType="circle" radialLines={false} stroke="none"  className="first:fill-gray-200 last:fill-white"
              polarRadius={[82, 78]}/>
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false}  axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold leading-3 p-0"
                        >
                          {chartData.percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-[12px]"
                        >
                          Completed
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
          )}
    </div >
    );
}

export default ChartGoal