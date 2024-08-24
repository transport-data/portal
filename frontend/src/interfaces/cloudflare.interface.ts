export interface CloudflareReturn {
  result: Record<string, unknown>;
  success: boolean;
  errors: Record<string, unknown>[];
  messages: string[];
}
