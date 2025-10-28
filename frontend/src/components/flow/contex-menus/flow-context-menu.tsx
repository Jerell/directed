import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  formatShortcutForDisplay,
  useCommands,
} from "@/context/keybind-provider";
import { Plus } from "lucide-react";

export function FlowContextMenu({ children }: { children: React.ReactNode }) {
  const { runCommand, commands } = useCommands([
    {
      id: "new-branch",
      label: "New branch",
      run: () => {
        console.log("New document");
      },
      group: "Flow",
      icon: <Plus />,
    },
  ]);

  const flowCommands = commands.filter((cmd) => cmd.group === "Flow");
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        {flowCommands.map((cmd) => (
          <ContextMenuItem key={cmd.id} inset>
            {cmd.icon} {cmd.label}
            {cmd.shortcut && (
              <ContextMenuShortcut>
                {formatShortcutForDisplay(cmd.shortcut)}
              </ContextMenuShortcut>
            )}
          </ContextMenuItem>
        ))}

        {/* <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem>Save Page...</ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup> */}
      </ContextMenuContent>
    </ContextMenu>
  );
}
