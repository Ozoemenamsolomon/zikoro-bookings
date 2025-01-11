import { redirect } from 'next/navigation'

const workspacePage = async ({
    params: { workspaceAlias },
    searchParams: { s },
  }: {
    params: { workspaceAlias: string };
    searchParams: { s: string };
  }) => {
    redirect('/ws')
}

export default workspacePage