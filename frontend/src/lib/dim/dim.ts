// Plain WebAssembly instantiation without WASI so it works on server and client

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
      const isBrowser =
        typeof window !== "undefined" && typeof document !== "undefined";
      let instance: WebAssembly.Instance & { exports: DimExports };
      if (isBrowser) {
        const res = await fetch("/dim/dim_wasm.wasm");
        const bytes = await res.arrayBuffer();
        let currentMemory: WebAssembly.Memory | null = null;
        const wasiImports = {
          wasi_snapshot_preview1: {
            fd_write: (
              _fd: number,
              iovPtr: number,
              iovCnt: number,
              nwrittenPtr: number
            ) => {
              if (!currentMemory) return 0;
              const dv = new DataView(currentMemory.buffer);
              let total = 0;
              for (let i = 0; i < iovCnt; i++) {
                const base = iovPtr + i * 8;
                const len = dv.getUint32(base + 4, true);
                total += len;
              }
              dv.setUint32(nwrittenPtr, total, true);
              return 0;
            },
            random_get: (bufPtr: number, bufLen: number) => {
              if (!currentMemory) return 0;
              const out = new Uint8Array(currentMemory.buffer, bufPtr, bufLen);
              const globalWithCrypto = globalThis as unknown as {
                crypto?: { getRandomValues?: (arr: Uint8Array) => void };
              };
              const cryptoObj = globalWithCrypto.crypto;
              if (
                cryptoObj &&
                typeof cryptoObj.getRandomValues === "function"
              ) {
                cryptoObj.getRandomValues(out);
              } else {
                for (let i = 0; i < bufLen; i++) out[i] = 0;
              }
              return 0;
            },
            fd_close: () => 0,
            fd_seek: () => 0,
            fd_read: () => 0,
            fd_pread: () => 0,
            fd_pwrite: () => 0,
            fd_fdstat_get: () => 0,
            fd_filestat_get: () => 0,
            path_filestat_get: () => 0,
            fd_prestat_get: () => 0,
            fd_prestat_dir_name: () => 0,
            path_open: () => 0,
            environ_sizes_get: (countPtr: number, bufSizePtr: number) => {
              if (!currentMemory) return 0;
              const dv = new DataView(currentMemory.buffer);
              dv.setUint32(countPtr, 0, true);
              dv.setUint32(bufSizePtr, 0, true);
              return 0;
            },
            environ_get: () => 0,
            args_sizes_get: (argcPtr: number, argvBufSizePtr: number) => {
              if (!currentMemory) return 0;
              const dv = new DataView(currentMemory.buffer);
              dv.setUint32(argcPtr, 0, true);
              dv.setUint32(argvBufSizePtr, 0, true);
              return 0;
            },
            args_get: () => 0,
            clock_time_get: () => 0,
            proc_exit: (_code: number) => 0,
          },
        } as WebAssembly.Imports;
        const result = (await WebAssembly.instantiate(
          bytes,
          wasiImports
        )) as WebAssembly.WebAssemblyInstantiatedSource;
        const inst = result.instance as unknown as WebAssembly.Instance & {
          exports: DimExports;
        };
        currentMemory = (inst.exports as DimExports).memory;
        instance = inst;
      } else {
        const { readFile } = await import("node:fs/promises");
        const { join } = await import("node:path");
        const filePath = join(process.cwd(), "public", "dim", "dim_wasm.wasm");
        const buf = await readFile(filePath);
        const bytes = buf.buffer.slice(
          buf.byteOffset,
          buf.byteOffset + buf.byteLength
        );
        let currentMemory: WebAssembly.Memory | null = null;
        const wasiImports = {
          wasi_snapshot_preview1: {
            fd_write: (
              _fd: number,
              iovPtr: number,
              iovCnt: number,
              nwrittenPtr: number
            ) => {
              if (!currentMemory) return 0;
              const dv = new DataView(currentMemory.buffer);
              let total = 0;
              for (let i = 0; i < iovCnt; i++) {
                const base = iovPtr + i * 8;
                const len = dv.getUint32(base + 4, true);
                total += len;
              }
              dv.setUint32(nwrittenPtr, total, true);
              return 0;
            },
            random_get: (bufPtr: number, bufLen: number) => {
              if (!currentMemory) return 0;
              const out = new Uint8Array(currentMemory.buffer, bufPtr, bufLen);
              const globalWithCrypto = globalThis as unknown as {
                crypto?: { getRandomValues?: (arr: Uint8Array) => void };
              };
              const cryptoObj = globalWithCrypto.crypto;
              if (
                cryptoObj &&
                typeof cryptoObj.getRandomValues === "function"
              ) {
                cryptoObj.getRandomValues(out);
              } else {
                for (let i = 0; i < bufLen; i++) out[i] = 0;
              }
              return 0;
            },
            fd_close: () => 0,
            fd_seek: () => 0,
            fd_read: () => 0,
            fd_pread: () => 0,
            fd_pwrite: () => 0,
            fd_fdstat_get: () => 0,
            fd_filestat_get: () => 0,
            path_filestat_get: () => 0,
            fd_prestat_get: () => 0,
            fd_prestat_dir_name: () => 0,
            path_open: () => 0,
            environ_sizes_get: (countPtr: number, bufSizePtr: number) => {
              if (!currentMemory) return 0;
              const dv = new DataView(currentMemory.buffer);
              dv.setUint32(countPtr, 0, true);
              dv.setUint32(bufSizePtr, 0, true);
              return 0;
            },
            environ_get: () => 0,
            args_sizes_get: (argcPtr: number, argvBufSizePtr: number) => {
              if (!currentMemory) return 0;
              const dv = new DataView(currentMemory.buffer);
              dv.setUint32(argcPtr, 0, true);
              dv.setUint32(argvBufSizePtr, 0, true);
              return 0;
            },
            args_get: () => 0,
            clock_time_get: () => 0,
            proc_exit: (_code: number) => 0,
          },
        } as WebAssembly.Imports;
        const result = (await WebAssembly.instantiate(
          bytes,
          wasiImports
        )) as WebAssembly.WebAssemblyInstantiatedSource;
        instance = result.instance as unknown as WebAssembly.Instance & {
          exports: DimExports;
        };
        currentMemory = (instance.exports as DimExports).memory;
      }

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
