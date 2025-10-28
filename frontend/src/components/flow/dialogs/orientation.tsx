import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import styles from "@/components/flow/flow.module.css";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { BranchNodeData } from "@/lib/types/flow-nodes";
import { ModuleBlockSequence } from "../branch-node";

function RadioOptionCard({
  children,
  label,
  value,
}: {
  children: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Label className="flex flex-col group" aria-label={label}>
      <div className="flex flex-col justify-end p-1 relative min-h-20 min-w-20 group-has-data-[state='checked']:bg-secondary/10 text-brand-purple-bright">
        <div className={cn(styles.corner)} data-position="top-left" />
        <div className={cn(styles.corner)} data-position="top-right" />
        <div className={cn(styles.corner)} data-position="bottom-left" />
        <div className={cn(styles.corner)} data-position="bottom-right" />
        <div className="[&_button]:pointer-events-none pointer-events-none">
          {children}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span>{label}</span>
        <RadioGroupItem value={value} />
      </div>
    </Label>
  );
}

export function BranchOrientationDialog({
  onClose,
  data,
}: {
  onClose?: () => void;
  data: BranchNodeData;
}) {
  return (
    <div className={cn(styles.branchNode, "relative flex flex-col gap-1")}>
      <RadioGroup className="grid grid-cols-2 lg:grid-cols-4 items-end relative p-1">
        <RadioOptionCard label="Left to Right" value="left-to-right">
          <ModuleBlockSequence blocks={data.blocks} interactive={false} />
        </RadioOptionCard>
        <RadioOptionCard label="Top to Bottom" value="top-to-bottom">
          {/* <ModuleBlockSequence
            blocks={data.blocks}
            interactive={false}
            orientation="top-to-bottom"
            detail={false}
          /> */}
          <p>Imagine it for now</p>
        </RadioOptionCard>
        <RadioOptionCard label="Right to Left" value="right-to-left">
          <ModuleBlockSequence
            blocks={data.blocks}
            interactive={false}
            orientation="right-to-left"
          />
        </RadioOptionCard>
        <RadioOptionCard label="Bottom to Top" value="bottom-to-top">
          {/* <ModuleBlockSequence
            blocks={data.blocks}
            interactive={false}
            orientation="bottom-to-top"
            detail={false}
          /> */}
          <p>Imagine it for now</p>
        </RadioOptionCard>
      </RadioGroup>

      <Separator className="my-1 bg-primary" />

      <RadioGroup className="grid grid-cols-2 relative p-1 self-center">
        <RadioOptionCard label="Regular" value="regular">
          <ModuleBlockSequence blocks={data.blocks} interactive={false} />
          <h3 className="font-medium text-xl">{data.label}</h3>
        </RadioOptionCard>

        <RadioOptionCard label="Goofy" value="goofy">
          <h3 className="font-medium text-xl">{data.label}</h3>
          <ModuleBlockSequence blocks={data.blocks} interactive={false} />
        </RadioOptionCard>
      </RadioGroup>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button>Apply</Button>
      </div>
    </div>
  );
}
