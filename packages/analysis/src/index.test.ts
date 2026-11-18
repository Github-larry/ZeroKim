import { describe, expect, it } from "vitest";
import { packageName } from "./index";

describe("@zerotrader/analysis workspace wiring (smoke test)", () => {
  it("exports its package name", () => {
    expect(packageName).toBe("@zerotrader/analysis");
  });
});
