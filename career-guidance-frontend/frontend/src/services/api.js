const API_BASE_URL = "http://localhost:5000/api";

function getStoredToken() {
  const directToken =
    localStorage.getItem("token") ||
    localStorage.getItem("career_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt");

  if (directToken && directToken !== "null" && directToken !== "undefined") {
    return directToken;
  }

  try {
    const rawUser = localStorage.getItem("user") || localStorage.getItem("authUser");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      return parsed?.token || parsed?.data?.token || null;
    }
  } catch {
    // fallback if JSON parse fails
  }

  return null;
}

export async function request(endpoint, options = {}) {
  const token = getStoredToken();

  console.log(`[API Request] ${endpoint} | Token:`, token);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response (backend issue)");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}