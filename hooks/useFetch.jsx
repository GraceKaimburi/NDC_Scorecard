"use client";

import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "@/utils/access-token";
import { BACKEND_BASE_URL } from "@/utils/constants";
import { isResponseOk } from "@/utils/is-response-ok";
import axios from "axios";

export default function useFetch() {
  const BASE_URL = BACKEND_BASE_URL;
  const openAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const privateAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  privateAPI.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  });

  privateAPI.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 401) {
        // Refresh the token and retry the request
        const refreshToken = getRefreshToken();
        const response = await axios.post(
          `${BASE_URL}/auth/refresh_token/`,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (isResponseOk(response)) {
          console.log({ response });

          const data = response.data;
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          return privateAPI.request(error.config);
        } else {
          console.error("Error refreshing token:", response);
        }
      }
      return Promise.reject(error);
    }
  );

  return { openAPI, privateAPI };
}
