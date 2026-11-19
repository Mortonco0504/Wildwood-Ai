import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("normalizes names to kebab-case", () => {
    expect(slugify("Rocky Raccoon")).toBe("rocky-raccoon");
    expect(slugify("  Rosie!! ")).toBe("rosie");
  });
});
