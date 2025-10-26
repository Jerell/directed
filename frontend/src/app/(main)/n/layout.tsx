import { FlowNetworkWrapper } from "../flow-network-wrapper";

export default function NodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid @max-4xl:grid-rows-2 4xl:grid-cols-2 gap-px h-full min-h-0 w-full">
      <FlowNetworkWrapper />
      <div className="h-full overflow-scroll border border-brand-blue p-px">
        {children}
      </div>
    </div>
  );
}
