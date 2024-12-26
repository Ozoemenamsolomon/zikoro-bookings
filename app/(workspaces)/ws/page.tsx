
const WsPage = async ({
    params: { workspaceAlias },
    searchParams: { s },
  }: {
    params: { workspaceAlias: string };
    searchParams: { s: string };
  }) => {
    return (
        <section className="min-h-screen flex justify-center items-center font-semibold text-center">Incomplete Url</section>
    )
}

export default WsPage