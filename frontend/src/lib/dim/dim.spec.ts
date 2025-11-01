import { beforeAll, describe, expect, it, test } from "vitest";
import {
  initDim,
  evalDim,
  defineConst,
  checkUnitCompatibility,
  checkDimensionalCompatibility,
} from "./dim";

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
    expect(evalDim("1 c as m/s")).toBe("299792458.000 m/s");
  });
});

describe("unit compatibility (one expression, one unit)", () => {
  test("m -> other", () => {
    expect(checkUnitCompatibility("1 m", "m")).toBe(true);
    expect(checkUnitCompatibility("1 m", "C")).toBe(false);
    expect(checkUnitCompatibility("1 m", "m/s")).toBe(false);
  });
});

describe("dimensional compatibility (two expressions)", () => {
  test("m -> other", () => {
    expect(checkDimensionalCompatibility("1 m", "1 m")).toBe(true);
    expect(checkDimensionalCompatibility("1 m", "1 C")).toBe(false);
    expect(checkDimensionalCompatibility("1 m", "1 m/s")).toBe(false);
  });
});
