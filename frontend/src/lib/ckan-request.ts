import { CkanRequestError } from "@datopian/ckan-api-client-js";

// Use server-only CKAN_URL if available (for internal k8s communication),
// otherwise fall back to NEXT_PUBLIC_CKAN_URL (public URL)
const ckanUrl = process.env.CKAN_URL ?? process.env.NEXT_PUBLIC_CKAN_URL;

// Default timeout of 120 seconds (120000ms) for long-running operations like resource_upsert_many
const DEFAULT_TIMEOUT = 120000;

// Helper to create request with timeout using AbortController
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

function headersFromOptions(options?: Record<string, unknown>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.apiKey) {
    headers["Authorization"] = options.apiKey as string;
  }

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  return headers;
}

const CkanRequestWithUrl = {
  post: async <T = any>(action: string, options?: Record<string, unknown>): Promise<T> => {
    const timeout = (options as any)?.timeout ?? DEFAULT_TIMEOUT;
    const url = `${ckanUrl}/api/3/action/${action}`;

    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: headersFromOptions(options),
        body: options?.formData ? (options.formData as any) : JSON.stringify(options?.json),
      },
      timeout
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new CkanRequestError(data);
    }

    return data as T;
  },
  get: async <T = any>(action: string, options?: Record<string, unknown>): Promise<T> => {
    const timeout = (options as any)?.timeout ?? DEFAULT_TIMEOUT;
    const url = `${ckanUrl}/api/3/action/${action}`;

    const response = await fetchWithTimeout(
      url,
      {
        method: "GET",
        headers: headersFromOptions(options),
      },
      timeout
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new CkanRequestError(data);
    }

    return data as T;
  },
};

export { CkanRequestError };
export default CkanRequestWithUrl;
