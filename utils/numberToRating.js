/**
 *
 * @param {number} num
 * @returns
 */
export const numberToRating = (num) => {
    const normalizedScore = (num / 6) * 100;
    if (normalizedScore >= 70) return "Good";
    if (normalizedScore >= 40) return "Average";
    return "Poor";
  };
  