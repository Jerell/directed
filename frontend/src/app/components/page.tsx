import { Button } from "@/components/ui/button";
import { ButtonGroupDemo } from "./demo/button-group-demo";

export default function ComponentsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <Button>Button</Button>
      <Button disabled>Button</Button>
      <Button variant="destructive">Button</Button>
      <Button variant="destructive" disabled>
        Button
      </Button>
      <Button variant="outline">Button</Button>
      <Button variant="outline" disabled>
        Button
      </Button>
      <Button variant="secondary">Button</Button>
      <Button variant="secondary" disabled>
        Button
      </Button>
      <Button variant="ghost">Button</Button>
      <Button variant="ghost" disabled>
        Button
      </Button>
      <Button variant="link">Button</Button>
      <Button variant="link" disabled>
        Button
      </Button>
      <div className="text-white">
        <ButtonGroupDemo />
      </div>
    </div>
  );
}
