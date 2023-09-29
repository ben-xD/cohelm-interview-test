// Use the environment variable if available, otherwise use relative path.
export const backendUrl = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL + "/api"
  : "/api";
