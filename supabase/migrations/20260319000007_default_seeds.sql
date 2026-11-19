-- Default locations + helpers. Character cast is seeded per-user via app action
-- (see lib/characters/seed.ts) so each studio owner gets Rocky/Rosie/Ranger/Finn.

CREATE OR REPLACE FUNCTION public.seed_default_locations(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.locations (user_id, slug, name, description, visual_prompt, is_default)
  VALUES
    (
      p_user_id,
      'wildwood-clearing',
      'Wildwood Clearing',
      'A sunny clearing at the heart of the Little Wildwood, soft moss underfoot and dappled light through oak leaves.',
      'Warm sunlit woodland clearing, soft moss, wildflowers, gentle dappled light, children''s storybook illustration, consistent Little Wildwood style',
      true
    ),
    (
      p_user_id,
      'river-bend',
      'River Bend',
      'A gentle bend in the creek where stones are smooth and reeds whisper.',
      'Gentle woodland river bend, clear shallow water, smooth stones, reeds, soft storybook lighting, Little Wildwood style',
      false
    ),
    (
      p_user_id,
      'hollow-tree',
      'Hollow Tree Den',
      'A cozy hollow in an ancient oak used as a gathering den.',
      'Cozy hollow oak tree den interior, warm amber light, soft moss bedding, storybook illustration, Little Wildwood style',
      false
    ),
    (
      p_user_id,
      'meadow-path',
      'Meadow Path',
      'A winding path through tall meadow grass at the edge of the forest.',
      'Winding meadow path at forest edge, tall grasses, butterflies, soft afternoon light, children''s storybook, Little Wildwood style',
      false
    )
  ON CONFLICT (user_id, slug) DO NOTHING;
END;
$$;

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

  PERFORM public.seed_default_locations(NEW.id);

  RETURN NEW;
END;
$$;

-- Trigger already created in previous migration; recreate to pick up new function body.
DROP TRIGGER IF EXISTS on_profile_created_defaults ON public.profiles;
CREATE TRIGGER on_profile_created_defaults
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_defaults();
