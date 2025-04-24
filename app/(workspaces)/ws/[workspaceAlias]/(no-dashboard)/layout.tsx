import ProtectWorkspaceWrapper from "@/components/workspace/ProtectWorkspaceWrapper";
import { Loader2Icon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Schedule and manage appointments`,
};

export default async function WorkspaceLayout({
  params,
  children,
}: {
  params: { workspaceAlias: string };
  children: React.ReactNode;
}) {
  return (
      <Suspense
        fallback={
          <section className="w-full pt-40 flex justify-center items-center">
            <Loader2Icon className="animate-spin text-zikoroBlue" />
          </section>
        }
      >
        <ProtectWorkspaceWrapper workspaceAlias={params.workspaceAlias}>
          {children}
        </ProtectWorkspaceWrapper>
      </Suspense>
  );
}
