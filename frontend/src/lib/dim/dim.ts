import { init, WASI } from "@wasmer/wasi";

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

let initPromise: Promise<void> | null = null;
let runtime: DimRuntime | null = null;

export async function initDim(): Promise<void> {
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

      runtime = {
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
  return initPromise;
}

function writeUtf8(rt: DimRuntime, str: string) {
  const bytes = rt.enc.encode(str);
  const ptr = rt.dim_alloc(bytes.length);
  new Uint8Array(rt.memory.buffer, ptr, bytes.length).set(bytes);
  return { ptr, len: bytes.length };
}

function evalDimCore(rt: DimRuntime, expr: string): string {
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

function defineConstCore(rt: DimRuntime, name: string, expr: string): void {
  const n = writeUtf8(rt, name);
  const v = writeUtf8(rt, expr);
  const rc = rt.dim_define(n.ptr, n.len, v.ptr, v.len);
  rt.dim_free(n.ptr, n.len);
  rt.dim_free(v.ptr, v.len);
  if (rc !== 0) throw new Error("dim_define failed");
}

export function evalDim(expr: string): string {
  if (!runtime) {
    throw new Error("dim not initialized. Call initDim() first.");
  }
  return evalDimCore(runtime, expr);
}

export function defineConst(name: string, expr: string): void {
  if (!runtime) {
    throw new Error("dim not initialized. Call initDim() first.");
  }
  defineConstCore(runtime, name, expr);
}
