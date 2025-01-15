'use client'

import { cn } from '@/lib';
import React, { useEffect, useRef, useState } from 'react'

const LineClampText = ({text, lenght=100, className}:{text:string, lenght?:number, className?:string}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (descriptionRef.current) {
          const { scrollHeight, clientHeight } = descriptionRef.current;
          setIsOverflowing(scrollHeight > clientHeight);
        }
      }, [text]);
    
  return (
    < >
        <div
            ref={descriptionRef}
            className={
                cn(`text-sm relative transition-all transform duration-500 ease  ${
              isExpanded ? 'max-h-full' : 'max-h-[4.5rem] overflow-hidden '
            }`, className)
        }
          >
            <p className="leading-">{text}</p>
        </div>
          {isOverflowing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 text-[12px] font-semibold mt-1 underline"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
    </ >
  )
}

export default LineClampText