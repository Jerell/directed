"use client";

import { HomeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { resetFlowToPreset } from "@/lib/collections/flow";
import { flowPresets } from "@/lib/collections/flow-network-presets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="flex items-center justify-between text-white">
      <div className="flex items-center gap-px">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Home">
            <HomeIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">New</Button>
          <Button variant="outline">Open</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Presets</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuGroup>
                {flowPresets.map((preset) => (
                  <DropdownMenuItem
                    key={preset.id}
                    onClick={async () => {
                      await resetFlowToPreset(preset);
                    }}
                  >
                    {preset.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>Manage presets…</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
      <h1 className="text-2xl font-bold mr-1">Directed</h1>
    </header>
  );
}
