import Main from "@/components/workspace/Main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Schedule and manage appointments`,
};

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
      <Main>
        {children}
      </Main>
  );
}
