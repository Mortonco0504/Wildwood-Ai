-- Wildwood Studio — extensions and shared enums
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE public.job_status AS ENUM (
  'queued',
  'running',
  'succeeded',
  'failed',
  'cancelled',
  'waiting_external'
);

CREATE TYPE public.episode_status AS ENUM (
  'draft',
  'planning',
  'generating',
  'rendering',
  'ready',
  'published',
  'failed',
  'archived'
);

CREATE TYPE public.asset_type AS ENUM (
  'image',
  'video',
  'audio',
  'subtitle',
  'thumbnail',
  'composite'
);

CREATE TYPE public.social_platform AS ENUM (
  'youtube',
  'tiktok',
  'instagram'
);

CREATE TYPE public.publish_status AS ENUM (
  'draft',
  'scheduled',
  'uploading',
  'published',
  'failed',
  'removed'
);

CREATE TYPE public.check_severity AS ENUM (
  'info',
  'warn',
  'block'
);

CREATE TYPE public.reference_kind AS ENUM (
  'front',
  'side',
  'three_quarter',
  'expression',
  'outfit',
  'other'
);

CREATE TYPE public.character_status AS ENUM (
  'active',
  'archived'
);
