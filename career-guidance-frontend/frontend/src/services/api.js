const API_BASE_URL = "http://localhost:5000/api";

export async function request(endpoint, options = {}) {
  // Grab token from localStorage
  const token = localStorage.getItem("token") || localStorage.getItem("career_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}