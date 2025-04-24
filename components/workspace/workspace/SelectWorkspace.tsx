'use client';

import { PopoverMenu } from '@/components/shared/PopoverMenu';
import { ChevronDown, SquarePen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import CreateWorkSpace from './CreateWorkSpace';
import useUserStore from '@/store/globalUserStore';
import { usePathname, useRouter } from 'next/navigation';
import { fetchCurrencies } from '@/lib/server/workspace';
import { BookingsCurrencyConverter } from '@/types';
import Link from 'next/link';
// import { getWorkspacePath } from '@/utils/urlHelpers';


 
export const getWorkspacePath = (workspaceAlias: string, path: string = '') => {
  return `/ws/${workspaceAlias}${path.startsWith('/') ? path : `/${path}`}`;
};


const SelectWorkspace = () => {
  const { user, currentWorkSpace, workspaces, setCurrentWorkSpace } = useUserStore();
  const pathname = usePathname();
  // const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /** Handle Workspace Selection */
  const handleWorkspaceChange = (wsAlias: string) => {
    // setCurrentWorkSpace(workspaces.find((ws) => ws.organizationAlias === wsAlias)!);
    // router.push(getWorkspacePath(wsAlias, pathname.split('/').slice(3).join('/')));
    // setIsOpen(false)
  };
  
  return (
    <PopoverMenu
      className="w-52"
      align="end"
      isOpen={isOpen}
      onOpenChange={setIsOpen} 
      trigerBtn={
        <button
          type="button"
          className="rounded-md w-full py-2 px-4 border flex justify-between gap-4 items-center"
        >
          <p className="w-full truncate min-w-0 text-start font-semibold">
            {currentWorkSpace?.organizationName }
          </p>
          <ChevronDown size={14} className="shrink-0" />
        </button>
      }
    >
      <div onClick={e=>e.stopPropagation()} className="bg-white shadow rounded-md p-4 space-y-1 text-sm w-full text-gray-800">
        {workspaces?.map((ws) => (
          <div  key={ws?.id} className="flex gap-2 items-center">
            <Link
              href={(getWorkspacePath(ws.organizationAlias!, pathname.split('/').slice(3).join('/')))}
              onClick={() => setIsOpen(false)}
              className={`block w-full truncate min-w-0 hover:bg-baseLight hover:text-zikoroBlue duration-300 px-3 py-1.5 rounded-md text-start ${
                currentWorkSpace?.id === ws?.id ? 'bg-baseLight text-zikoroBlue' : ''
              }`}
            >
              {ws?.organizationName}
            </Link>

            {/* {ws?.organizationOwnerId===user?.id ? 
            <CreateWorkSpace
              currencies={currencies}
              onClose={setIsOpen}
              workSpaceData={ws!}
              button={
                <button className="shrink-0">
                  <SquarePen
                    size={18}
                    className="text-gray-500 hover:text-zikoroBlue duration-500"
                  />
                </button>
              }
            /> :
            <div className='w-8 shrink-0'></div>
            } */}
          </div>
        ))}
        <CreateWorkSpace onClose={setIsOpen}  />
      </div>
    </PopoverMenu>
  );
};

export default React.memo(SelectWorkspace);
