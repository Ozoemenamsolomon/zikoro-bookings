import type { Metadata } from "next";
import SettingsMain from "@/components/workspace/Settings/SettingsMain";

export const metadata: Metadata = {
  title: `Zikoro: Appointment Settings`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
 
  return (
    <SettingsMain>
      {children}
    </SettingsMain>
)
}
