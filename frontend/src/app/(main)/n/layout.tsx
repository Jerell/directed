import { FlowNetworkWrapper } from "../flow-network-wrapper";

export default function NodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid @max-4xl:grid-rows-2 4xl:grid-cols-2 gap-px h-full w-full">
      <FlowNetworkWrapper />
      {children}
    </div>
  );
}
