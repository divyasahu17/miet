// Utility function to properly construct API URLs
// In production, use the local API proxy to avoid CORS issues
export const getApiUrl = (endpoint: string): string => {
  // Ensure endpoint starts with slash and has 'api/' prefix
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Check if we're running in the browser
  const isBrowser = typeof window !== 'undefined';

  // In production browser environment, use local API routes to proxy requests
  // This avoids CORS issues by having Next.js server make the backend requests
  if (isBrowser && process.env.NODE_ENV === 'production') {
    // Use local API routes - the endpoint should already start with 'api/'
    // So we just return it as is (relative URL)
    return cleanEndpoint;
  }

  // In development or server-side, use the backend URL directly
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${cleanEndpoint}`;
};

// Get the backend URL for constructing image URLs and other static resources
// These should always use the backend URL directly
export const getBackendUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return ''; // Always return empty string in production so images use relative paths
  }
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};
