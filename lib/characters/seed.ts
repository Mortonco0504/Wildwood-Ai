import type { Character } from "@/types/database";

export type SeedCharacter = Pick<
  Character,
  | "slug"
  | "name"
  | "species"
  | "personality"
  | "physical_description"
  | "clothing"
  | "visual_style"
  | "consistency_prompt"
  | "sort_order"
>;

/**
 * Canonical Little Wildwood cast. Seeded per authenticated user via Character Studio.
 */
export const CANONICAL_CAST: SeedCharacter[] = [
  {
    slug: "rocky",
    name: "Rocky",
    species: "raccoon",
    sort_order: 1,
    personality:
      "Curious, clever, and a little mischievous. Rocky notices every detail, loves solving tiny mysteries, and always looks out for friends even when he pretends to be cool about it.",
    physical_description:
      "A small raccoon with soft gray-and-black ringed fur, bright curious eyes, rounded ears, and a bushy ringed tail. Friendly child-friendly proportions, expressive face, gentle storybook silhouette.",
    clothing:
      "A worn but tidy olive adventurer vest with two small pockets, a short red scarf loosely knotted, and sturdy little brown boots.",
    visual_style:
      "Children's storybook 2D animation, soft painted textures, warm woodland palette, clean outlines, consistent character model sheet look.",
    consistency_prompt:
      "Always draw Rocky the raccoon: gray-black ringed fur, bright curious eyes, olive adventurer vest, red scarf, brown boots. Same face, proportions, and clothing every shot. Soft children's storybook style, Little Wildwood universe. No redesigns, no realistic fur, no horror.",
  },
  {
    slug: "rosie",
    name: "Rosie",
    species: "rabbit",
    sort_order: 2,
    personality:
      "Kind, gentle, and nurturing. Rosie notices when someone feels left out, loves sharing snacks, and finds brave solutions through care and teamwork.",
    physical_description:
      "A soft cream-and-peach rabbit with long upright ears tipped in rose-pink, large warm brown eyes, a small pink nose, and a fluffy round tail. Soft rounded storybook proportions.",
    clothing:
      "A light sage cardigan with wooden buttons over a pale yellow dress, and a tiny flower pin near the collar.",
    visual_style:
      "Children's storybook 2D animation, soft painted textures, warm woodland palette, clean outlines, consistent character model sheet look.",
    consistency_prompt:
      "Always draw Rosie the rabbit: cream-peach fur, rose-pink ear tips, sage cardigan, pale yellow dress, flower pin. Same face, proportions, and clothing every shot. Soft children's storybook style, Little Wildwood universe. No redesigns.",
  },
  {
    slug: "ranger",
    name: "Ranger",
    species: "fox",
    sort_order: 3,
    personality:
      "Brave, protective, and steady. Ranger is the quiet leader who plans ahead, keeps the group safe, and teaches courage without raising his voice.",
    physical_description:
      "A slender fox with warm orange fur, cream chest and muzzle, pointed ears, sharp but friendly amber eyes, and a full white-tipped tail. Heroic but soft storybook proportions.",
    clothing:
      "A forest-green ranger cloak fastened with a wooden leaf clasp, a simple leather belt, and muted brown trail shoes.",
    visual_style:
      "Children's storybook 2D animation, soft painted textures, warm woodland palette, clean outlines, consistent character model sheet look.",
    consistency_prompt:
      "Always draw Ranger the fox: warm orange fur, cream muzzle, white-tipped tail, forest-green cloak with leaf clasp. Same face, proportions, and clothing every shot. Soft children's storybook style, Little Wildwood universe. No redesigns.",
  },
  {
    slug: "finn",
    name: "Finn",
    species: "squirrel",
    sort_order: 4,
    personality:
      "Energetic, funny, and quick. Finn blurts jokes mid-adventure, dashes ahead, then circles back when friends need a laugh or a helping paw.",
    physical_description:
      "A bright chestnut squirrel with a huge fluffy tail, rounded cheeks, sparkling dark eyes, and twitchy whiskers. Compact playful storybook proportions.",
    clothing:
      "A sky-blue hoodie with rolled sleeves and a small acorn emblem on the chest, plus comfy gray shorts.",
    visual_style:
      "Children's storybook 2D animation, soft painted textures, warm woodland palette, clean outlines, consistent character model sheet look.",
    consistency_prompt:
      "Always draw Finn the squirrel: chestnut fur, huge fluffy tail, sky-blue hoodie with acorn emblem, gray shorts. Same face, proportions, and clothing every shot. Soft children's storybook style, Little Wildwood universe. No redesigns.",
  },
];

export const DEFAULT_VOICE_NOTES: Record<string, string> = {
  rocky: "Youthful curious male raccoon; light mischief; clear and friendly.",
  rosie: "Warm gentle female rabbit; soft and reassuring; never shrill.",
  ranger: "Calm protective male fox; steady low-mid tone; kind authority.",
  finn: "Bouncy playful male squirrel; quick delivery; cheerful laughs.",
};
