import { Handle, HandleProps } from "@xyflow/react";
import styles from "./flow.module.css";
import { cn } from "@/lib/utils";

export function BranchHandle({
  type,
  position,
  onConnect,
  ...props
}: HandleProps) {
  return (
    <Handle
      type={type}
      position={position}
      onConnect={onConnect}
      className={cn(styles.branchHandle)}
      {...props}
    />
  );
}
