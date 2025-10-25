import { HomeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

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
        </ButtonGroup>
      </div>
      <h1 className="text-2xl font-bold mr-1">Directed</h1>
    </header>
  );
}
