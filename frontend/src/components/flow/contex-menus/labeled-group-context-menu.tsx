import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCommands } from "@/context/keybind-provider";
import { Plus, Trash } from "lucide-react";
import { LabeledGroupNodeData } from "@/lib/types/flow-nodes";

export function LabeledGroupContextMenu({
  children,
  data,
  selected,
}: {
  children: React.ReactNode;
  data: LabeledGroupNodeData;
  selected: boolean;
}) {
  const { runCommand, commands } = useCommands([
    {
      id: "remove-labeled-group",
      label: "Remove",
      run: () => {
        console.log("Remove labeled group");
      },
      group: "Labeled Group",
      icon: <Trash />,
    },
    {
      id: "add-branch",
      label: "Add branch",
      run: () => {
        console.log("Add branch");
      },
      group: "Labeled Group",
      icon: <Plus />,
    },
  ]);

  const labeledGroupCommands = commands.filter(
    (cmd) => cmd.group === "Labeled Group"
  );
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel inset>{data.label}</ContextMenuLabel>
          {labeledGroupCommands.map((cmd) => (
            <ContextMenuItem key={cmd.id} inset>
              {cmd.icon} {cmd.label}
              <ContextMenuShortcut>{cmd.shortcut}</ContextMenuShortcut>
            </ContextMenuItem>
          ))}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
