import CkanRequest, { CkanRequestError } from "@datopian/ckan-api-client-js";

// Use server-only CKAN_URL if available (for internal k8s communication),
// otherwise fall back to NEXT_PUBLIC_CKAN_URL (public URL)
const ckanUrl = process.env.CKAN_URL ?? process.env.NEXT_PUBLIC_CKAN_URL;

const CkanRequestWithUrl = {
  post: <T>(action: string, options?: Record<string, unknown>) =>
    CkanRequest.post<T>(action, { ...options, ckanUrl }),
  get: <T>(action: string, options?: Record<string, unknown>) =>
    CkanRequest.get<T>(action, { ...options, ckanUrl }),
};

export { CkanRequestError };
export default CkanRequestWithUrl;
