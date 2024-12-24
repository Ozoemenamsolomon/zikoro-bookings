'use client'

import { PopoverMenu } from '@/components/shared/PopoverMenu'
import { ArrowDown, ChevronDown, PlusCircle } from 'lucide-react'
import React from 'react'
import CreateWorkSpace from './CreateWorkSpace'

const SelectWorkspace = () => {
  return (
    <PopoverMenu
        className="w-full"
        align="end"
        trigerBtn={
          <button type='button' className="rounded-md w-full py-2 px-4 border flex justify-between gap-6 items-center ">
            <p className="">My Workspace</p>
            <ChevronDown size={14} />
          </button >
        }
      >
        <div className="bg-white shadow rounded-md p-4 space-y-3 text-sm w-full text-gray-800">

          <CreateWorkSpace/>
        </div>
      </PopoverMenu>
  )
}

export default SelectWorkspace