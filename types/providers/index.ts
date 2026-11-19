/** Provider adapter contracts — stubs for Phases 2–6. Do not call live APIs in Phase 1. */

export type ProviderName =
  | "openai"
  | "kling"
  | "elevenlabs"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "mock";

export interface ProviderAdapter {
  name: ProviderName;
  /** True when real credentials are configured; false means mock/stub only. */
  isConfigured: boolean;
}

export interface MockProviderResult<T = unknown> {
  mocked: true;
  provider: ProviderName;
  message: string;
  data?: T;
}
