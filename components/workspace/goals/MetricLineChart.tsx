"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { KeyResult, KeyResultsTimeline } from "@/types/goal";
import { Loader2 } from "lucide-react";
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
        x: format(new Date(item.created_at!), 'dd/MM') || "",
        y: item.value || 0,
      }));
  
      // Add the start and end dates
      const startDatePoint = {
        x: format(new Date(keyResult.startDate!), 'dd/MM'),
        y: keyResult.startValue||keyResult.currentValue||0,
      };
  
      const endDatePoint = {
        x: format(new Date(keyResult.endDate!), 'dd/MM'),
        y: keyResult.targetValue,
      };
  
      return [startDatePoint, ...formattedTimelineData, endDatePoint];
    }, [timelineData, keyResult.startValue, keyResult.targetValue, keyResult.startDate, keyResult.endDate]);
  
    // Determine Y-axis range
    const yAxisRange = useMemo(() => {
      if (!keyResult.startValue || !keyResult.targetValue) return [0, 100];
      const maxTimelineValue = timelineData?.reduce((max, item) => Math.max(max, item.value || 0), 0) || 0;
      return [keyResult.startValue, Math.max(keyResult.targetValue, maxTimelineValue)];
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
            <ChartContainer config={{}} className="w-full max-w-[28rem] mx-auto h-60">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -14, bottom: 15 }}>
                  <CartesianGrid stroke="#cccccc" strokeOpacity={0.7} strokeDasharray="3 3" />

                  <XAxis
                    dataKey="x"
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
                    dataKey="y"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
            </ChartContainer>
          )}
        </>
    );
  };
  
  export default MetricLineChart;
  