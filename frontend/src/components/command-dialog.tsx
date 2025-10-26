"use client";

import { CreditCard, File, FilePlus, Settings, User } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { CmdOrCtrl } from "./ui/command";
import {
  normalizeShortcut,
  useKeybindContext,
} from "@/context/keybind-provider";

export function GlobalCommandDialog() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    commands,
    registerCommand,
  } = useKeybindContext();

  useEffect(() => {
    const unregisters: Array<() => void> = [];

    unregisters.push(
      registerCommand({
        id: "new",
        label: "New",
        run: () => console.log("New command"),
        shortcut: "N",
        group: "Suggestions",
        icon: <FilePlus />,
      })
    );

    unregisters.push(
      registerCommand({
        id: "open-file",
        label: "Open file",
        run: () => console.log("Open file"),
        shortcut: "Mod+O",
        group: "Suggestions",
        icon: <File />,
      })
    );

    unregisters.push(
      registerCommand({
        id: "profile",
        label: "Profile",
        run: () => console.log("Profile"),
        shortcut: "Mod+P",
        group: "Settings",
        icon: <User />,
      })
    );

    unregisters.push(
      registerCommand({
        id: "billing",
        label: "Billing",
        run: () => console.log("Billing"),
        shortcut: "Mod+B",
        group: "Settings",
        icon: <CreditCard />,
      })
    );

    unregisters.push(
      registerCommand({
        id: "settings",
        label: "Settings",
        run: () => console.log("Settings"),
        shortcut: "Mod+S",
        group: "Settings",
        icon: <Settings />,
      })
    );

    return () => {
      for (const off of unregisters) off();
    };
  }, [registerCommand]);

  const groups = Array.from(
    commands.reduce<Map<string | undefined, typeof commands>>((map, cmd) => {
      const key = cmd.group;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cmd);
      return map;
    }, new Map())
  );

  return (
    <>
      <Button
        variant="outline"
        aria-label="Open command dialog"
        onClick={() => setCommandPaletteOpen(true)}
      >
        View Commands
        <span className="text-muted-foreground text-sm">
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">
              <CmdOrCtrl />
            </span>
            J
          </kbd>
        </span>
      </Button>

      <CommandDialog
        open={isCommandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groups.map(([groupName, groupCommands]) => (
            <CommandGroup key={groupName ?? "ungrouped"} heading={groupName}>
              {groupCommands.map((cmd) => (
                <CommandItem
                  key={cmd.id}
                  onSelect={() => {
                    cmd.run();
                    setCommandPaletteOpen(false);
                  }}
                >
                  {cmd.icon}
                  <span>{cmd.label}</span>
                  {cmd.shortcut ? (
                    <CommandShortcut>
                      {normalizeShortcut(cmd.shortcut).key.toUpperCase()}
                    </CommandShortcut>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
