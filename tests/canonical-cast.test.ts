import { describe, expect, it } from "vitest";
import { CANONICAL_CAST } from "@/lib/characters/seed";

describe("canonical cast", () => {
  it("includes Rocky, Rosie, Ranger, and Finn with required fields", () => {
    const slugs = CANONICAL_CAST.map((c) => c.slug).sort();
    expect(slugs).toEqual(["finn", "ranger", "rocky", "rosie"]);

    for (const character of CANONICAL_CAST) {
      expect(character.name.length).toBeGreaterThan(0);
      expect(character.personality.length).toBeGreaterThan(20);
      expect(character.physical_description.length).toBeGreaterThan(20);
      expect(character.clothing.length).toBeGreaterThan(10);
      expect(character.visual_style.length).toBeGreaterThan(10);
      expect(character.consistency_prompt.length).toBeGreaterThan(40);
    }
  });
});
