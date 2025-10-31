import { beforeAll, describe, expect, it } from "vitest";
import { initDim, evalDim, defineConst } from "./dim";

beforeAll(async () => {
  await initDim();
});

describe("dim wasm", () => {
  it("evaluates multiplication with units", () => {
    expect(evalDim("2 m * 3 m")).toBe("6.000 m²");
  });

  it("evaluates identity", () => {
    expect(evalDim("1 m")).toBe("1.000 m");
  });

  it("defines constant and evaluates cast", () => {
    defineConst("c", "299792458 m/s");
    expect(evalDim("c as m/s")).toBe("299792458.000 m/s");
  });
});
