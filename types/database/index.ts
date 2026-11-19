export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type JobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "waiting_external";

export type EpisodeStatus =
  | "draft"
  | "planning"
  | "generating"
  | "rendering"
  | "ready"
  | "published"
  | "failed"
  | "archived";

export type AssetType =
  | "image"
  | "video"
  | "audio"
  | "subtitle"
  | "thumbnail"
  | "composite";

export type SocialPlatform = "youtube" | "tiktok" | "instagram";

export type PublishStatus =
  | "draft"
  | "scheduled"
  | "uploading"
  | "published"
  | "failed"
  | "removed";

export type CheckSeverity = "info" | "warn" | "block";

export type ReferenceKind =
  | "front"
  | "side"
  | "three_quarter"
  | "expression"
  | "outfit"
  | "other";

export type CharacterStatus = "active" | "archived";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "owner" | "editor" | "viewer";
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  species: string | null;
  personality: string;
  physical_description: string;
  clothing: string;
  visual_style: string;
  consistency_prompt: string;
  status: CharacterStatus;
  sort_order: number;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface CharacterReference {
  id: string;
  character_id: string;
  user_id: string;
  kind: ReferenceKind;
  label: string | null;
  storage_path: string | null;
  public_url: string | null;
  notes: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  description: string;
  visual_prompt: string;
  is_default: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface VoiceProfile {
  id: string;
  user_id: string;
  character_id: string | null;
  name: string;
  provider: string;
  provider_voice_id: string | null;
  language: string;
  style_notes: string;
  sample_url: string | null;
  is_default: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  user_id: string;
  title: string;
  synopsis: string;
  status: EpisodeStatus;
  target_platforms: SocialPlatform[];
  duration_seconds: number | null;
  scheduled_for: string | null;
  published_at: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface AutomationSettings {
  id: string;
  user_id: string;
  enabled: boolean;
  timezone: string;
  posts_per_day: number;
  preferred_post_hours: number[];
  daily_budget_usd: number;
  monthly_budget_usd: number;
  auto_publish: boolean;
  require_quality_gate: boolean;
  target_platforms: SocialPlatform[];
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> };
      characters: {
        Row: Character;
        Insert: Omit<Character, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Character>;
      };
      character_references: {
        Row: CharacterReference;
        Insert: Omit<CharacterReference, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<CharacterReference>;
      };
      locations: {
        Row: Location;
        Insert: Omit<Location, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Location>;
      };
      voice_profiles: {
        Row: VoiceProfile;
        Insert: Omit<VoiceProfile, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<VoiceProfile>;
      };
      episodes: {
        Row: Episode;
        Insert: Omit<Episode, "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Episode>;
      };
      automation_settings: {
        Row: AutomationSettings;
        Insert: Omit<AutomationSettings, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<AutomationSettings>;
      };
    };
  };
}
