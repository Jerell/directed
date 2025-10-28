import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCommands } from "@/context/keybind-provider";
import { RotateCw, Trash } from "lucide-react";
import { BranchNodeData } from "@/lib/types/flow-nodes";
import { openDialog } from "@/context/dialog-provider";
import { BranchOrientationDialog } from "../dialogs/orientation";

export function BranchContextMenu({
  children,
  data,
  selected,
}: {
  children: React.ReactNode;
  data: BranchNodeData;
  selected: boolean;
}) {
  const { runCommand, commands } = useCommands([
    {
      id: "remove-branch",
      label: "Remove branch",
      run: () => {
        console.log("Remove branch");
      },
      group: "Branch",
      icon: <Trash />,
    },
  ]);

  function handleOrientation() {
    openDialog(
      ({ close }) => <BranchOrientationDialog onClose={close} data={data} />,
      {
        title: "Orientation",
        description: "Configure the orientation of the branch",
      }
    );
  }

  const branchCommands = commands.filter((cmd) => cmd.group === "Branch");
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel inset>{data.label}</ContextMenuLabel>
          {branchCommands.map((cmd) => (
            <ContextMenuItem key={cmd.id} inset>
              {cmd.icon} {cmd.label}
              <ContextMenuShortcut>{cmd.shortcut}</ContextMenuShortcut>
            </ContextMenuItem>
          ))}
        </ContextMenuGroup>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Appearance</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuGroup>
              <ContextMenuItem onSelect={handleOrientation}>
                <RotateCw /> Orientation
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuCheckboxItem checked>
                Show details
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem>Hide details</ContextMenuCheckboxItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
