const { getAccessToken } = require("./access-token");
const { BACKEND_BASE_URL } = require("./constants");

let accessToken = getAccessToken();

export async function fetchWithAuth(url, options = {}) {
  try {
    // Try the request with the current access token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("with auth status", response.status);

    // const text = await response.text();
    // console.log("with auth text", text);

    // If unauthorized, refresh the token and retry
    if (response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      accessToken = await refreshAccessToken(refreshToken);
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `JWT ${accessToken}`,
        },
      });
      return retryResponse;
    }

    return response;
  } catch (error) {
    console.error("Request failed", error);
    throw error;
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  // console.log("refreshing token using current:", refreshToken);
  const response = await fetch(`${BACKEND_BASE_URL}/auth/refresh_token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({  
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok) {
    // Clear stored auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('refreshToken');
    
    window.location.href='/login'
    // throw new Error("Your session has expired. Please log in again.");
  }
  const data = await response.json();
  return data.access_token;
}
