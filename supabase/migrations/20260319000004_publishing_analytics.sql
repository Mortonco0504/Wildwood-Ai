-- Social accounts, publishing jobs, published posts, analytics

CREATE TABLE public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  platform public.social_platform NOT NULL,
  account_name TEXT NOT NULL,
  external_account_id TEXT,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, platform, external_account_id)
);

CREATE INDEX social_accounts_user_id_idx ON public.social_accounts (user_id);

CREATE TABLE public.publishing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.episodes (id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES public.social_accounts (id) ON DELETE SET NULL,
  platform public.social_platform NOT NULL,
  status public.publish_status NOT NULL DEFAULT 'draft',
  scheduled_for TIMESTAMPTZ,
  title TEXT,
  description TEXT,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX publishing_jobs_user_id_idx ON public.publishing_jobs (user_id);
CREATE INDEX publishing_jobs_episode_id_idx ON public.publishing_jobs (episode_id);
CREATE INDEX publishing_jobs_status_idx ON public.publishing_jobs (status);

CREATE TABLE public.published_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.episodes (id) ON DELETE CASCADE,
  publishing_job_id UUID REFERENCES public.publishing_jobs (id) ON DELETE SET NULL,
  social_account_id UUID REFERENCES public.social_accounts (id) ON DELETE SET NULL,
  platform public.social_platform NOT NULL,
  external_post_id TEXT NOT NULL,
  url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, external_post_id)
);

CREATE INDEX published_posts_user_id_idx ON public.published_posts (user_id);
CREATE INDEX published_posts_episode_id_idx ON public.published_posts (episode_id);

CREATE TABLE public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  published_post_id UUID REFERENCES public.published_posts (id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes (id) ON DELETE SET NULL,
  platform public.social_platform NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  views BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  comments BIGINT NOT NULL DEFAULT 0,
  shares BIGINT NOT NULL DEFAULT 0,
  watch_time_seconds NUMERIC(14, 2) NOT NULL DEFAULT 0,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX analytics_snapshots_user_id_idx ON public.analytics_snapshots (user_id);
CREATE INDEX analytics_snapshots_post_id_idx ON public.analytics_snapshots (published_post_id);
CREATE INDEX analytics_snapshots_captured_at_idx ON public.analytics_snapshots (captured_at);

CREATE TRIGGER social_accounts_set_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER publishing_jobs_set_updated_at
  BEFORE UPDATE ON public.publishing_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER published_posts_set_updated_at
  BEFORE UPDATE ON public.published_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
