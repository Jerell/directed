import { Button } from "@/components/ui/button";
import { ButtonGroupDemo } from "./demo/button-group-demo";

export default function ComponentsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <Button>Button</Button>
      <Button disabled>Button</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="destructive" disabled>
        Destructive Disabled
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline" disabled>
        Outline Disabled
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="secondary" disabled>
        Secondary Disabled
      </Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost" disabled>
        Ghost Disabled
      </Button>
      <Button variant="link">Link</Button>
      <Button variant="link" disabled>
        Link Disabled
      </Button>
      <div className="text-white">
        <ButtonGroupDemo />
      </div>
    </div>
  );
}
