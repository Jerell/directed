import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCommands } from "@/context/keybind-provider";
import { Plus, Trash } from "lucide-react";
import { LabeledGroupNodeData } from "@/lib/types/flow-nodes";
import { openDialog } from "@/context/dialog-provider";
import { Button } from "@/components/ui/button";

export function LabeledGroupContextMenu({
  children,
  data,
  selected: _selected,
}: {
  children: React.ReactNode;
  data: LabeledGroupNodeData;
  selected: boolean;
}) {
  const { runCommand, commands } = useCommands([
    {
      id: "remove-labeled-group",
      label: "Remove group",
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
        openDialog(
          ({ close }) => (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {`Coming soon: Add a branch to "${data.label}".`}
              </p>
              <div className="flex justify-end">
                <Button onClick={close}>Close</Button>
              </div>
            </div>
          ),
          {
            title: "Add branch",
            description: "Configure a new branch for this labeled group.",
          }
        );
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
            <ContextMenuItem
              key={cmd.id}
              inset
              onSelect={() => runCommand(cmd)}
            >
              {cmd.icon} {cmd.label}
              <ContextMenuShortcut>{cmd.shortcut}</ContextMenuShortcut>
            </ContextMenuItem>
          ))}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
