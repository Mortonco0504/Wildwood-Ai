import { z } from "zod";

export const characterFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .optional()
    .or(z.literal("")),
  species: z.string().max(80).optional().or(z.literal("")),
  personality: z.string().max(4000).default(""),
  physical_description: z.string().max(4000).default(""),
  clothing: z.string().max(2000).default(""),
  visual_style: z.string().max(2000).default(""),
  consistency_prompt: z.string().max(4000).default(""),
  status: z.enum(["active", "archived"]).default("active"),
});

export type CharacterFormValues = z.infer<typeof characterFormSchema>;

export const characterReferenceSchema = z.object({
  character_id: z.string().uuid(),
  kind: z
    .enum(["front", "side", "three_quarter", "expression", "outfit", "other"])
    .default("other"),
  label: z.string().max(120).optional().or(z.literal("")),
  public_url: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(2000).default(""),
  is_primary: z.boolean().default(false),
});

export const voiceProfileSchema = z.object({
  character_id: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(120),
  provider: z.string().min(1).max(64).default("elevenlabs"),
  provider_voice_id: z.string().max(120).optional().or(z.literal("")),
  language: z.string().max(16).default("en"),
  style_notes: z.string().max(2000).default(""),
  sample_url: z.string().url().optional().or(z.literal("")),
  is_default: z.boolean().default(false),
});
