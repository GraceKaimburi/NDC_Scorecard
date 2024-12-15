/**
 *
 * @param {import("axios").AxiosResponse} response
 * @returns
 */
export function isResponseOk(response) {
    return response.status >= 200 && response.status < 300;
  }
  