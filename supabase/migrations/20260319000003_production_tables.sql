-- Episodes, scripts, scenes, assets, generation & render jobs

CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  synopsis TEXT NOT NULL DEFAULT '',
  status public.episode_status NOT NULL DEFAULT 'draft',
  target_platforms public.social_platform[] NOT NULL DEFAULT ARRAY['youtube', 'tiktok', 'instagram']::public.social_platform[],
  duration_seconds INT,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX episodes_user_id_idx ON public.episodes (user_id);
CREATE INDEX episodes_status_idx ON public.episodes (user_id, status);

CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES public.episodes (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  title TEXT,
  raw_text TEXT NOT NULL DEFAULT '',
  structured JSONB NOT NULL DEFAULT '{}'::jsonb,
  provider TEXT,
  model TEXT,
  is_current BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (episode_id, version)
);

CREATE INDEX scripts_episode_id_idx ON public.scripts (episode_id);
CREATE INDEX scripts_user_id_idx ON public.scripts (user_id);

CREATE TABLE public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES public.episodes (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  script_id UUID REFERENCES public.scripts (id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations (id) ON DELETE SET NULL,
  scene_number INT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  dialogue TEXT NOT NULL DEFAULT '',
  visual_prompt TEXT NOT NULL DEFAULT '',
  duration_seconds NUMERIC(8, 2),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (episode_id, scene_number)
);

CREATE INDEX scenes_episode_id_idx ON public.scenes (episode_id);
CREATE INDEX scenes_user_id_idx ON public.scenes (user_id);

CREATE TABLE public.scene_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES public.scenes (id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role_in_scene TEXT NOT NULL DEFAULT 'featured',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (scene_id, character_id)
);

CREATE INDEX scene_characters_scene_id_idx ON public.scene_characters (scene_id);
CREATE INDEX scene_characters_character_id_idx ON public.scene_characters (character_id);

CREATE TABLE public.scene_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES public.scenes (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  asset_type public.asset_type NOT NULL,
  storage_path TEXT,
  public_url TEXT,
  provider TEXT,
  provider_asset_id TEXT,
  width INT,
  height INT,
  duration_seconds NUMERIC(8, 2),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX scene_assets_scene_id_idx ON public.scene_assets (scene_id);
CREATE INDEX scene_assets_user_id_idx ON public.scene_assets (user_id);

CREATE TABLE public.generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes (id) ON DELETE SET NULL,
  scene_id UUID REFERENCES public.scenes (id) ON DELETE SET NULL,
  job_type TEXT NOT NULL,
  status public.job_status NOT NULL DEFAULT 'queued',
  provider TEXT,
  external_task_id TEXT,
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  attempts INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT generation_jobs_external_task_id_unique UNIQUE (external_task_id)
);

CREATE INDEX generation_jobs_user_id_idx ON public.generation_jobs (user_id);
CREATE INDEX generation_jobs_status_idx ON public.generation_jobs (status);
CREATE INDEX generation_jobs_episode_id_idx ON public.generation_jobs (episode_id);

CREATE TABLE public.render_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.episodes (id) ON DELETE CASCADE,
  status public.job_status NOT NULL DEFAULT 'queued',
  output_path TEXT,
  output_url TEXT,
  ffmpeg_profile TEXT NOT NULL DEFAULT 'shorts_9x16',
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX render_jobs_user_id_idx ON public.render_jobs (user_id);
CREATE INDEX render_jobs_episode_id_idx ON public.render_jobs (episode_id);
CREATE INDEX render_jobs_status_idx ON public.render_jobs (status);

CREATE TRIGGER episodes_set_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER scripts_set_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER scenes_set_updated_at
  BEFORE UPDATE ON public.scenes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER scene_assets_set_updated_at
  BEFORE UPDATE ON public.scene_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER generation_jobs_set_updated_at
  BEFORE UPDATE ON public.generation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER render_jobs_set_updated_at
  BEFORE UPDATE ON public.render_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
