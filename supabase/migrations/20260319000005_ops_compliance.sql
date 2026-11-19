-- Provider usage, automation settings, content checks, audit logs

CREATE TABLE public.provider_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  operation TEXT NOT NULL,
  units NUMERIC(14, 4) NOT NULL DEFAULT 0,
  unit_label TEXT NOT NULL DEFAULT 'tokens',
  cost_usd NUMERIC(12, 6) NOT NULL DEFAULT 0,
  episode_id UUID REFERENCES public.episodes (id) ON DELETE SET NULL,
  generation_job_id UUID REFERENCES public.generation_jobs (id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX provider_usage_user_id_idx ON public.provider_usage (user_id);
CREATE INDEX provider_usage_recorded_at_idx ON public.provider_usage (recorded_at);
CREATE INDEX provider_usage_provider_idx ON public.provider_usage (provider);

CREATE TABLE public.automation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  posts_per_day INT NOT NULL DEFAULT 1 CHECK (posts_per_day >= 0 AND posts_per_day <= 24),
  preferred_post_hours INT[] NOT NULL DEFAULT ARRAY[9, 17],
  daily_budget_usd NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
  monthly_budget_usd NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
  auto_publish BOOLEAN NOT NULL DEFAULT false,
  require_quality_gate BOOLEAN NOT NULL DEFAULT true,
  target_platforms public.social_platform[] NOT NULL DEFAULT ARRAY['youtube', 'tiktok', 'instagram']::public.social_platform[],
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX automation_settings_user_id_idx ON public.automation_settings (user_id);

CREATE TABLE public.content_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes (id) ON DELETE CASCADE,
  scene_id UUID REFERENCES public.scenes (id) ON DELETE SET NULL,
  check_type TEXT NOT NULL,
  severity public.check_severity NOT NULL DEFAULT 'info',
  passed BOOLEAN NOT NULL DEFAULT false,
  message TEXT NOT NULL DEFAULT '',
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX content_checks_user_id_idx ON public.content_checks (user_id);
CREATE INDEX content_checks_episode_id_idx ON public.content_checks (episode_id);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs (user_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at);
CREATE INDEX audit_logs_action_idx ON public.audit_logs (action);

CREATE TRIGGER automation_settings_set_updated_at
  BEFORE UPDATE ON public.automation_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed automation_settings when a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.automation_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_defaults
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_defaults();
