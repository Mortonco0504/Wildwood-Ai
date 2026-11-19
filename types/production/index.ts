/** Production pipeline types — Phase 2+ engines will expand these. */

export type PipelineStage =
  | "story"
  | "images"
  | "animation"
  | "audio"
  | "render"
  | "quality"
  | "publishing"
  | "analytics";

export interface PipelineJobRef {
  id: string;
  stage: PipelineStage;
  status: string;
  episodeId?: string;
  sceneId?: string;
}

export interface ScenePlan {
  sceneNumber: number;
  title: string;
  description: string;
  dialogue: string;
  characterSlugs: string[];
  locationSlug?: string;
  durationSeconds?: number;
}
