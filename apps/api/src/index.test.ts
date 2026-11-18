import { describe, expect, it } from "vitest";
import { packageName } from "./index";

describe("@zerotrader/api workspace wiring (smoke test)", () => {
  it("exports its package name", () => {
    expect(packageName).toBe("@zerotrader/api");
  });
});
