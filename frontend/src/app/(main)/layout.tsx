import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full w-full border border-brand-blue bg-brand-teal p-px text-brand-purple-bright">
      <Header />
      {children}
    </div>
  );
}
