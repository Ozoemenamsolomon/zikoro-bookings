import WorkspaceAlert from '@/components/workspace/WorkspaceAlert';
import React from 'react';

export default async function WorkspaceLayout({
  params,
  children,
}: {
  params: { workspaceAlias: string };
  children: React.ReactNode;
}) {

  return (
    <>
      {/* <WorkspaceAlert /> */}
      {children}
    </>
  );
}
