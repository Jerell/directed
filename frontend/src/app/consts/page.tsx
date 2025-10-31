import { DimConstantsForm } from "@/components/dim/constants-form";

export default function ConstsPage() {
  return (
    <div className="flex flex-col">
      <DimConstantsForm initial={[{ name: "c", expr: "299792458 m/s" }]} />
    </div>
  );
}
