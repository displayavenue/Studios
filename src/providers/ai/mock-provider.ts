import type { AiProvider, AiCompletionRequest, AiCompletionResponse } from "./types";

export class MockAiProvider implements AiProvider {
  async complete(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const last = request.messages.filter((m) => m.role === "user").pop();
    return {
      content: `This is a mock interpretive response to: "${last?.content ?? "your question"}". Astrology insights here are for reflection and entertainment only.`,
      mock: true,
      disclaimer: "Mock AI provider — not real astrological counsel.",
    };
  }
}

export function createAiProvider(): AiProvider {
  return new MockAiProvider();
}
