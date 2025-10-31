"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearAllConsts, defineConst, initDim } from "@/lib/dim/dim";
import { useDimReady } from "@/lib/dim/use-dim-ready";
import { cn } from "@/lib/utils";

type ConstantRow = {
  id: string;
  name: string;
  expr: string;
};

function createRow(partial?: Partial<ConstantRow>): ConstantRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    expr: "",
    ...partial,
  };
}

export function DimConstantsForm(props: {
  className?: string;
  initial?: Array<{ name: string; expr: string }>;
}) {
  const { className, initial } = props;
  const ready = useDimReady();

  const initialRows = useMemo<ConstantRow[]>(() => {
    if (!initial || initial.length === 0) return [createRow()];
    return initial.map((c) => createRow({ name: c.name, expr: c.expr }));
  }, [initial]);

  const [rows, setRows] = useState<ConstantRow[]>(initialRows);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const onChangeRow = useCallback(
    (id: string, field: "name" | "expr", value: string) => {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
      setSavedAt(null);
      setError(null);
    },
    []
  );

  const onAddRow = useCallback(() => {
    setRows((prev) => [...prev, createRow()]);
  }, []);

  const onRemoveRow = useCallback((id: string) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }, []);

  const onSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await initDim();
      // Clear everything, then define only what is currently in the form
      clearAllConsts();
      for (const r of rows) {
        const name = r.name.trim();
        const expr = r.expr.trim();
        if (!name || !expr) continue;
        defineConst(name, expr);
      }
      setSavedAt(Date.now());
    } catch (e) {
      setError((e as Error).message ?? "Failed to save constants");
    } finally {
      setSaving(false);
    }
  }, [rows]);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Units and constants</h3>
        <div className="flex items-center gap-2">
          <Button onClick={onAddRow} variant="outline" size="sm" type="button">
            Add row
          </Button>
          <Button onClick={onSave} disabled={!ready || saving} size="sm" type="button">
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 items-center gap-2">
        <div className="col-span-4 text-xs font-medium text-muted-foreground">Name</div>
        <div className="col-span-7 text-xs font-medium text-muted-foreground">Expression</div>
        <div className="col-span-1" />
        {rows.map((row) => (
          <div key={row.id} className="contents">
            <input
              className="col-span-4 h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="c"
              value={row.name}
              onChange={(e) => onChangeRow(row.id, "name", e.target.value)}
            />
            <input
              className="col-span-7 h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="299792458 m/s"
              value={row.expr}
              onChange={(e) => onChangeRow(row.id, "expr", e.target.value)}
            />
            <div className="col-span-1 flex items-center justify-end">
              <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                aria-label="Remove row"
                onClick={() => onRemoveRow(row.id)}
                disabled={rows.length === 1}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-5 text-sm">
        {!ready && <span className="text-muted-foreground">Loading DIM…</span>}
        {error && <span className="text-destructive">{error}</span>}
        {!error && savedAt && (
          <span className="text-muted-foreground">Saved.</span>
        )}
      </div>
    </div>
  );
}

export default DimConstantsForm;


