import type { MockProviderResult, ProviderAdapter, ProviderName } from "@/types/providers";

export function getProviderAdapter(name: ProviderName): ProviderAdapter {
  const envMap: Record<ProviderName, boolean> = {
    openai: Boolean(process.env.OPENAI_API_KEY),
    kling: Boolean(process.env.KLING_ACCESS_KEY || process.env.KLING_API_KEY),
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY),
    youtube: Boolean(process.env.YOUTUBE_CLIENT_ID),
    tiktok: Boolean(process.env.TIKTOK_CLIENT_KEY),
    instagram: Boolean(process.env.META_APP_ID),
    mock: true,
  };

  return {
    name,
    isConfigured: envMap[name],
  };
}

export function mockProviderCall(provider: ProviderName): MockProviderResult {
  return {
    mocked: true,
    provider,
    message: `MOCK ONLY — ${provider} is not called in Phase 1.`,
  };
}
