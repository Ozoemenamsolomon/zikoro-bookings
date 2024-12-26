'use client';

import { PopoverMenu } from '@/components/shared/PopoverMenu';
import { ChevronDown, SquarePen } from 'lucide-react';
import React from 'react';
import CreateWorkSpace from './CreateWorkSpace';
import useUserStore from '@/store/globalUserStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// import { getWorkspacePath } from '@/utils/urlHelpers';


 
export const getWorkspacePath = (workspaceAlias: string, path: string = '') => {
  return `/ws/${workspaceAlias}${path.startsWith('/') ? path : `/${path}`}`;
};


const SelectWorkspace = () => {
  const { user, currentWorkSpace, workspaces, setCurrentWorkSpace } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();

  /** Handle Workspace Selection */
  const handleWorkspaceChange = (wsAlias: string) => {
    setCurrentWorkSpace(workspaces.find((ws) => ws.workspaceAlias === wsAlias)!);
    router.push(getWorkspacePath(wsAlias, pathname.split('/').slice(3).join('/')));
  };

  return (
    <PopoverMenu
      className="w-52"
      align="end"
      trigerBtn={
        <button
          type="button"
          className="rounded-md w-full py-2 px-4 border flex justify-between gap-4 items-center"
        >
          <p className="w-full truncate min-w-0 text-start font-semibold">
            {currentWorkSpace?.workspaceName}
          </p>
          <ChevronDown size={14} className="shrink-0" />
        </button>
      }
    >
      <div className="bg-white shadow rounded-md p-4 space-y-1 text-sm w-full text-gray-800">
        {workspaces?.map((ws) => (
          <div key={ws?.id} className="flex gap-2 items-center">
            <button
              onClick={() => handleWorkspaceChange(ws.workspaceAlias)}
              className={`block w-full truncate min-w-0 hover:bg-baseLight hover:text-zikoroBlue duration-300 px-3 py-1.5 rounded-md ${
                currentWorkSpace?.id === ws?.id ? 'bg-baseLight text-zikoroBlue' : ''
              }`}
            >
              {ws?.workspaceName}
            </button>

            <CreateWorkSpace
              workSpaceData={ws!}
              button={
                <button className="shrink-0">
                  <SquarePen
                    size={18}
                    className="text-gray-500 hover:text-zikoroBlue duration-500"
                  />
                </button>
              }
            />
          </div>
        ))}
        <CreateWorkSpace />
      </div>
    </PopoverMenu>
  );
};

export default SelectWorkspace;
