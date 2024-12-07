/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 * If the input is not a string, it is returned as is
 */
export function capitalize(str) {
    if (typeof str !== "string") {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  