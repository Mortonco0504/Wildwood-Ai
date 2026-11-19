import { describe, expect, it } from "vitest";
import { mockProviderCall } from "@/lib/providers";

describe("provider stubs", () => {
  it("labels mock calls clearly", () => {
    const result = mockProviderCall("openai");
    expect(result.mocked).toBe(true);
    expect(result.message).toMatch(/MOCK ONLY/);
  });
});
