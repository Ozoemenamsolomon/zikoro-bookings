import ContactLayout from "@/components/workspace/contact";
import ContactSubLayout from "@/components/workspace/contact/ContactSubLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContactLayout>
      <ContactSubLayout>
        {children}
      </ContactSubLayout>
    </ContactLayout>
  );
}
