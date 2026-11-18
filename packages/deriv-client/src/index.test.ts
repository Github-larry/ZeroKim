import { describe, expect, it } from "vitest";
import { packageName } from "./index";

describe("@zerotrader/deriv-client workspace wiring (smoke test)", () => {
  it("exports its package name", () => {
    expect(packageName).toBe("@zerotrader/deriv-client");
  });
});
