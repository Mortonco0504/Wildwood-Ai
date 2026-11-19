"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { characterFormSchema } from "@/lib/validation/character";
import { CANONICAL_CAST, DEFAULT_VOICE_NOTES } from "@/lib/characters/seed";
import { slugify } from "@/lib/utils";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { supabase, user: null as null };
  }
  return { supabase, user };
}

export async function createCharacter(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const parsed = characterFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    species: formData.get("species") || "",
    personality: formData.get("personality") || "",
    physical_description: formData.get("physical_description") || "",
    clothing: formData.get("clothing") || "",
    visual_style: formData.get("visual_style") || "",
    consistency_prompt: formData.get("consistency_prompt") || "",
    status: formData.get("status") || "active",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const slug = values.slug && values.slug.length > 0 ? values.slug : slugify(values.name);

  const { data, error } = await supabase
    .from("characters")
    .insert({
      user_id: user.id,
      name: values.name,
      slug,
      species: values.species || null,
      personality: values.personality,
      physical_description: values.physical_description,
      clothing: values.clothing,
      visual_style: values.visual_style,
      consistency_prompt: values.consistency_prompt,
      status: values.status,
      sort_order: 0,
      metadata: {},
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/characters");
  redirect(`/characters/${data.id}`);
}

export async function updateCharacter(
  id: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const parsed = characterFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    species: formData.get("species") || "",
    personality: formData.get("personality") || "",
    physical_description: formData.get("physical_description") || "",
    clothing: formData.get("clothing") || "",
    visual_style: formData.get("visual_style") || "",
    consistency_prompt: formData.get("consistency_prompt") || "",
    status: formData.get("status") || "active",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const values = parsed.data;
  const slug = values.slug && values.slug.length > 0 ? values.slug : slugify(values.name);

  const { error } = await supabase
    .from("characters")
    .update({
      name: values.name,
      slug,
      species: values.species || null,
      personality: values.personality,
      physical_description: values.physical_description,
      clothing: values.clothing,
      visual_style: values.visual_style,
      consistency_prompt: values.consistency_prompt,
      status: values.status,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/characters");
  revalidatePath(`/characters/${id}`);
  return { ok: true, id };
}

export async function deleteCharacter(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/characters");
  redirect("/characters");
}

export async function seedCanonicalCast(): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  for (const cast of CANONICAL_CAST) {
    const { data: existing } = await supabase
      .from("characters")
      .select("id")
      .eq("user_id", user.id)
      .eq("slug", cast.slug)
      .maybeSingle();

    let characterId = existing?.id;

    if (!characterId) {
      const { data, error } = await supabase
        .from("characters")
        .insert({
          user_id: user.id,
          ...cast,
          status: "active",
          metadata: {},
        })
        .select("id")
        .single();
      if (error) return { ok: false, error: error.message };
      characterId = data.id;
    } else {
      const { error } = await supabase
        .from("characters")
        .update({
          name: cast.name,
          species: cast.species,
          personality: cast.personality,
          physical_description: cast.physical_description,
          clothing: cast.clothing,
          visual_style: cast.visual_style,
          consistency_prompt: cast.consistency_prompt,
          sort_order: cast.sort_order,
          status: "active",
        })
        .eq("id", characterId)
        .eq("user_id", user.id);
      if (error) return { ok: false, error: error.message };
    }

    const voiceName = `${cast.name} Voice`;
    const { data: voice } = await supabase
      .from("voice_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("character_id", characterId)
      .maybeSingle();

    if (!voice) {
      const { error: voiceError } = await supabase.from("voice_profiles").insert({
        user_id: user.id,
        character_id: characterId,
        name: voiceName,
        provider: "elevenlabs",
        provider_voice_id: null,
        language: "en",
        style_notes: DEFAULT_VOICE_NOTES[cast.slug] ?? "",
        is_default: true,
        metadata: { phase: 1, pending_provider: "elevenlabs" },
      });
      if (voiceError) return { ok: false, error: voiceError.message };
    }

    const { data: refs } = await supabase
      .from("character_references")
      .select("id")
      .eq("character_id", characterId)
      .limit(1);

    if (!refs?.length) {
      const { error: refError } = await supabase.from("character_references").insert({
        user_id: user.id,
        character_id: characterId,
        kind: "front",
        label: `${cast.name} primary model`,
        notes:
          "Placeholder reference row for Phase 1. Upload permanent visual refs in Phase 3.",
        is_primary: true,
        public_url: null,
        storage_path: null,
      });
      if (refError) return { ok: false, error: refError.message };
    }
  }

  revalidatePath("/characters");
  return { ok: true };
}

export async function addCharacterReference(
  characterId: string,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const label = String(formData.get("label") || "");
  const public_url = String(formData.get("public_url") || "");
  const notes = String(formData.get("notes") || "");
  const kind = String(formData.get("kind") || "other");

  const { error } = await supabase.from("character_references").insert({
    user_id: user.id,
    character_id: characterId,
    kind: kind as
      | "front"
      | "side"
      | "three_quarter"
      | "expression"
      | "outfit"
      | "other",
    label: label || null,
    public_url: public_url || null,
    notes,
    is_primary: false,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/characters/${characterId}`);
  return { ok: true };
}
