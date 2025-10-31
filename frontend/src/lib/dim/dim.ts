import { init, WASI } from "@wasmer/wasi";
import { Effect } from "effect";

type DimExports = {
  memory: WebAssembly.Memory;
  dim_alloc: (n: number) => number;
  dim_free: (ptr: number, len: number) => void;
  dim_eval: (
    inPtr: number,
    inLen: number,
    outPtrPtr: number,
    outLenPtr: number
  ) => number;
  dim_define: (
    namePtr: number,
    nameLen: number,
    exprPtr: number,
    exprLen: number
  ) => number;
  dim_clear: (ptr: number, len: number) => void;
  dim_clear_all: () => void;
};

type DimRuntime = DimExports & { enc: TextEncoder; dec: TextDecoder };

let initPromise: Promise<DimRuntime> | null = null;
let runtime: DimRuntime | null = null;

async function initDim(): Promise<DimRuntime> {
  if (!initPromise) {
    initPromise = (async () => {
      await init();
      const wasi = new WASI({});
      let mod: WebAssembly.Module;
      const isBrowser =
        typeof window !== "undefined" && typeof document !== "undefined";
      if (isBrowser) {
        const url = new URL("./dim_wasm.wasm", import.meta.url);
        mod = await WebAssembly.compileStreaming(fetch(url.href));
      } else {
        const { readFile } = await import("node:fs/promises");
        const url = new URL("./dim_wasm.wasm", import.meta.url);
        const bytes = await readFile(url);
        mod = await WebAssembly.compile(bytes);
      }
      const instance = (await wasi.instantiate(
        mod,
        {}
      )) as WebAssembly.Instance & { exports: DimExports };

      // Verify required exports exist
      const types = Object.fromEntries(
        Object.entries(instance.exports as Record<string, unknown>).map(
          ([k, v]) => [k, typeof v]
        )
      ) as Record<string, string>;
      const required: Array<keyof DimExports> = [
        "memory",
        "dim_alloc",
        "dim_free",
        "dim_eval",
        "dim_define",
      ];
      for (const name of required) {
        const t = types[name as string];
        const expected = name === "memory" ? "object" : "function";
        if (t !== expected) {
          throw new Error(
            `dim wasm exports mismatch: expected ${name} to be ${expected}. Actual: ${JSON.stringify(
              types
            )}`
          );
        }
      }

      const {
        memory,
        dim_alloc,
        dim_free,
        dim_eval,
        dim_define,
        dim_clear,
        dim_clear_all,
      } = instance.exports;

      return {
        memory,
        dim_alloc,
        dim_free,
        dim_eval,
        dim_define,
        dim_clear,
        dim_clear_all,
        enc: new TextEncoder(),
        dec: new TextDecoder(),
      };
    })();
  }
  runtime = await initPromise;
  return runtime;
}

function writeUtf8(rt: DimRuntime, str: string) {
  const bytes = rt.enc.encode(str);
  const ptr = rt.dim_alloc(bytes.length);
  new Uint8Array(rt.memory.buffer, ptr, bytes.length).set(bytes);
  return { ptr, len: bytes.length };
}

export function evalDimSync(expr: string): string {
  if (!initPromise) {
    throw new Error("dim not initialized. Call initDimEffect() first.");
  }
  const rt = runtime;
  if (!rt) throw new Error("dim runtime missing");
  const { ptr: inPtr, len: inLen } = writeUtf8(rt, expr);
  const scratch = rt.dim_alloc(8);
  const outPtrPtr = scratch;
  const outLenPtr = scratch + 4;
  const rc = rt.dim_eval(inPtr, inLen, outPtrPtr, outLenPtr);
  rt.dim_free(inPtr, inLen);
  if (rc !== 0) {
    rt.dim_free(scratch, 8);
    throw new Error("dim_eval failed");
  }
  const dv = new DataView(rt.memory.buffer);
  const outPtr = dv.getUint32(outPtrPtr, true);
  const outLen = dv.getUint32(outLenPtr, true);
  rt.dim_free(scratch, 8);
  const out = new Uint8Array(rt.memory.buffer, outPtr, outLen);
  const text = rt.dec.decode(out);
  rt.dim_free(outPtr, outLen);
  return text;
}

export function defineConstSync(name: string, expr: string): void {
  if (!initPromise) {
    throw new Error("dim not initialized. Call initDimEffect() first.");
  }
  const rt = runtime;
  if (!rt) throw new Error("dim runtime missing");
  const n = writeUtf8(rt, name);
  const v = writeUtf8(rt, expr);
  const rc = rt.dim_define(n.ptr, n.len, v.ptr, v.len);
  rt.dim_free(n.ptr, n.len);
  rt.dim_free(v.ptr, v.len);
  if (rc !== 0) throw new Error("dim_define failed");
}

export const initDimEffect = Effect.tryPromise({
  try: async () => {
    await initDim();
  },
  catch: (e) => (e instanceof Error ? e : new Error(String(e))),
});

export const evalDimEffect = (expr: string) =>
  initDimEffect.pipe(Effect.map(() => evalDimSync(expr)));

export const defineConstEffect = (name: string, expr: string) =>
  initDimEffect.pipe(Effect.map(() => defineConstSync(name, expr)));

// Convenience sync aliases after init
export const evalDim = evalDimSync;
export const defineConst = defineConstSync;
