import { cn } from '@/lib'
import { Loader2 } from 'lucide-react'

const Loading = ({size}:{size?:number}) => {
  return (
    <Loader2 size={size||20} className='animate-spin text-blue-600'/>
  )
}

export default Loading

export const BlockSlotSkeleton = ({size=2,className}:{size?:number, className?:string}) => {
  return (
     <div className={cn(`grid sm:grid-cols-2 w-full gap-3`,className)}>
       {
        [...Array(size)].map((_,i)=>(<div key={i} className='w-full h-44 rounded bg-slate-100 animate-pulse'></div>))
       }
     </div>
  )
}

export const BookingSlotSkeleton = ({size=8}:{size?:number}) => {
  return (
     <div className="space-y-3 w-full">
       {
        [...Array(size)].map((_,i)=>(<div key={i} className='w-full h-8 rounded bg-slate-100 animate-pulse'></div>))
       }
     </div>
  )
}

interface BookingSlotSkeletonProps {
  size?: number; // Adjusts the size of the skeleton cells
}

export const CalendarSkeleton: React.FC<BookingSlotSkeletonProps> = ({ size = 40 }) => {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="w-1/3 h-6 mx-auto  bg-slate-300 rounded animate-pulse"></div>

      {/* Calendar Grid */}
      <div
        className="grid grid-cols-7 gap-2"
        style={{
          gridAutoRows: `${size}px`,
        }}
      >
        {[...Array(42)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 rounded animate-pulse"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
