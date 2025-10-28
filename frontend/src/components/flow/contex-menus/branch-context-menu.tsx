import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCommands } from "@/context/keybind-provider";
import { RotateCw, Trash } from "lucide-react";

export function BranchContextMenu({ children }: { children: React.ReactNode }) {
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
    {
      id: "rotate-branch",
      label: "Rotate branch",
      run: () => {
        console.log("Rotate branch");
      },
      group: "Branch",
      icon: <RotateCw />,
    },
  ]);

  const branchCommands = commands.filter((cmd) => cmd.group === "Branch");
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        {branchCommands.map((cmd) => (
          <ContextMenuItem key={cmd.id} inset>
            {cmd.icon} {cmd.label}
            <ContextMenuShortcut>{cmd.shortcut}</ContextMenuShortcut>
          </ContextMenuItem>
        ))}
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show details</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Hide details</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
