import { CurrentSelection } from "./current-selection";

export function StatusRow() {
  return (
    <div className="flex flex-row gap-1 p-px text-foreground items-end">
      <CurrentSelection />
    </div>
  );
}
