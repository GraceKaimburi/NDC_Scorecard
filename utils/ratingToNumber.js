/**
 *
 * @param {'good'|'average'|'poor'} rating
 * @returns
 */
export const ratingToNumber = (rating) => {
    switch ((rating || "")?.toLowerCase()) {
      case "good":
        return 3;
      case "average":
        return 2;
      case "poor":
        return 1;
      default:
        return 0;
    }
  };
  