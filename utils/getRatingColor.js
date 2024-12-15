/**
 *
 * @param {'good'|'average'|'poor'} rating
 * @returns
 */
export const getRatingColor = (rating) => {
    switch ((rating || "")?.toLowerCase()) {
      case "good":
        return "text-green-600";
      case "average":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };
  