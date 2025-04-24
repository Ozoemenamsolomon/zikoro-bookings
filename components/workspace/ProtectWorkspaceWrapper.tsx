import React from 'react'
import { protectWorkspaceRoute } from '@/lib/server/protectWorkspaceRoute'
import WorkspaceLoader from './WorkspaceLoader'

const ProtectWorkspaceWrapper = async ({
  workspaceAlias,
  children
}: {
  workspaceAlias: string
  children: React.ReactNode
}) => {
  const { workspace, workspaces } = await protectWorkspaceRoute(workspaceAlias)

  if (!workspace || !workspaces) {
    return (
      <section className="pt-40 mx-auto text-center font-bold max-w-sm px-4">
        Page was not found! Check your network and refresh the page.
      </section>
    )
  }

  return (
    <>
      <WorkspaceLoader workspace={workspace} workspaces={workspaces} />
      {children}
    </>
  )
}

export default ProtectWorkspaceWrapper
