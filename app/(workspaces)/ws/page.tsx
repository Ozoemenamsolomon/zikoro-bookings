import WsComponent from "@/components/workspace/workspace";

const WsPage = async ({
    params: { workspaceAlias },
    searchParams: { s },
  }: {
    params: { workspaceAlias: string };
    searchParams: { s: string };
  }) => {
    return (
      <WsComponent />
    )
}

export default WsPage