export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("accessToken");
}


export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("refreshToken");
}

export function setAccessToken(token) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("accessToken", token);
}


export function setRefreshToken(token) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("refreshToken", token);
}

export function removeTokens() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}