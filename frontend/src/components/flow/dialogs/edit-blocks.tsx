import { BranchNodeData } from "@/lib/types/flow-nodes";
import styles from "@/components/flow/flow.module.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ModuleBlockSequence } from "../branch-node";

export function EditBlocksDialog({
  onClose,
  data,
}: {
  onClose?: () => void;
  data: BranchNodeData;
}) {
  return (
    <div className={cn(styles.branchNode, "relative flex flex-col gap-1")}>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <ModuleBlockSequence blocks={data.blocks} interactive={false} />
        <div className="flex flex-col gap-2">
          <Button variant="outline">Add Block</Button>
          <Button variant="outline">Remove Block</Button>
        </div>
      </div>
    </div>
  );
}
