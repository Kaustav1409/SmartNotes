// Centralized API base URL
// Uses VITE_API_URL environment variable in production, falls back to localhost for local dev.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE_URL;