export type AiMessage = { role: "user" | "assistant"; content: string };

export type AiCompletionRequest = {
  messages: AiMessage[];
  context?: { chartSummary?: string; productType?: string };
};

export type AiCompletionResponse = {
  content: string;
  mock: boolean;
  disclaimer: string;
};

export interface AiProvider {
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
}
