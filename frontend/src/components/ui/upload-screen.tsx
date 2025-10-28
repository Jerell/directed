"use client";

import React from "react";
import { Button } from "./button";

export function UploadScreen({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Choose a file to upload</p>
      </div>
      <input type="file" className="block" />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button>Upload</Button>
      </div>
    </div>
  );
}
