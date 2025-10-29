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
import { Move, Trash } from "lucide-react";
import {
  GeographicAnchorNodeData,
  GeographicWindowNodeData,
} from "@/lib/types/flow-nodes";
import { openDialog } from "@/context/dialog-provider";
import { Button } from "@/components/ui/button";

export function GeographicContextMenu({
  children,
  data,
  selected: _selected,
}: {
  children: React.ReactNode;
  data: GeographicAnchorNodeData | GeographicWindowNodeData;
  selected: boolean;
}) {
  const { runCommand, commands } = useCommands([
    {
      id: "remove-geographic-anchor",
      label: "Remove map",
      run: () => {
        console.log("Remove geographic anchor");
      },
      group: "Geographic",
      icon: <Trash />,
    },
    {
      id: "reposition",
      label: "Reposition",
      run: () => {
        openDialog(
          ({ close }) => (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{`Coming soon`}</p>
              <div className="flex justify-end">
                <Button onClick={close}>Close</Button>
              </div>
            </div>
          ),
          {
            title: "Reposition map",
            description: "Reposition or resize the map to a new location.",
          }
        );
      },
      group: "Geographic",
      icon: <Move />,
    },
  ]);

  const geographicCommands = commands.filter(
    (cmd) => cmd.group === "Geographic"
  );
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuGroup>
          <ContextMenuLabel inset>{data.label}</ContextMenuLabel>
          {geographicCommands.map((cmd) => (
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
