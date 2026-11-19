/** AI orchestration stubs — Phase 2+. */
export const AI_PHASE = 1;

export function assertProvidersNotCalledInPhase1() {
  return {
    mocked: true as const,
    message: "Live AI providers are not invoked in Phase 1.",
  };
}
