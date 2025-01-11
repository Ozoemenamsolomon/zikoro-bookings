"use client";

import React, {useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { KeyResult, KeyResultsTimeline } from "@/types/goal";
import { format } from "date-fns";

interface LineChartProps {
  keyResult: KeyResult;
  timeLine: { data: KeyResultsTimeline[] | null; error: string | null };
}
const MetricLineChart: React.FC<LineChartProps> = ({ keyResult, timeLine: { data: timelineData, error } }) => {
    // Memoize formatted chart data
    const chartData = useMemo(() => {
      if (!timelineData || !keyResult.targetValue) return null;
  
      const formattedTimelineData = timelineData.map((item) => ({
        Timeline: format(new Date(item.created_at!), 'dd/MM') || "",
        [keyResult?.unit!]: item.value || 0,
      }));
  
      // Add the start and end dates
      const startDatePoint = {
        Timeline: format(new Date(keyResult.startDate!), 'dd/MM'),
        [keyResult?.unit!]: keyResult.startValue||keyResult.currentValue||0,
      };
      const endDatePoint = {
        Timeline: format(new Date(keyResult.endDate!), 'dd/MM'),
        // [keyResult?.unit!]: keyResult.targetValue,
      };
  
      return [startDatePoint, ...formattedTimelineData, endDatePoint];
    }, [timelineData, keyResult.startValue, keyResult.targetValue, keyResult.startDate, keyResult.endDate]);
  
    // Determine Y-axis range
    const yAxisRange = useMemo(() => {
      if (!keyResult.startValue || !keyResult.targetValue) return [0, 100];
      const maxTimelineValue = timelineData?.reduce((max, item) => Math.max(max, item.value || 0), 0) || 0;
      // return [keyResult.startValue, Math.max(keyResult.targetValue, maxTimelineValue)];
      return [0, Math.max(keyResult.targetValue, maxTimelineValue)];
    }, [keyResult.startValue, keyResult.targetValue, timelineData]);

    //   console.log({keyResult, timelineData, chartData, yAxisRange})
    return (
        <>
          {error ? (
            <div className="py-20 flex justify-center text-sm text-center">
              <p>Error: {error}</p>
            </div>
          ) : !chartData ? (
            <div className="py-20 flex justify-center text-sm text-center">
              <p>No data available for this chart.</p>
            </div>
          ) : (
            <div className="w-full max-w-[28rem] mx-auto">
            <ChartContainer config={{}} className="w-full  h-60">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -14, bottom: 15 }}>
                  <CartesianGrid stroke="#cccccc" strokeOpacity={0.7} strokeDasharray="3 3" />

                  <XAxis
                    dataKey="Timeline"
                    tickFormatter={(value) => value}
                    label={{ value: "Timeline", position: "insideBottom", offset: -5 }}
                    axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }} // Customize the axis line
                    tickLine={{ stroke: "#cbd5e1", strokeWidth: 1 }} // Customize tick marks
                  />
                  <YAxis
                    domain={yAxisRange}
                    label={{ value: keyResult.unit || "Value", angle: -90, offset: 24, position: "insideLeft" }}
                    axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }} // Customize the axis line
                    tickLine={{ stroke: "#cbd5e1", strokeWidth: 1 }} // Customize tick marks
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="linear"
                    dataKey={keyResult?.unit!}
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
                
            </ChartContainer>
            <div className="flex text-[12px] font-semibold text-gray-500 -translate-y-1 justify-between gap-2">
              <small className="">Started: {format(new Date(keyResult?.startDate!), 'dd/MM/yyyy')}</small>
              <small className="">Ending: {format(new Date(keyResult?.endDate!), 'dd/MM/yyyy')}</small>
            </div>
            </div>
          )}
        </>
    );
  };
  
  export default MetricLineChart;
  