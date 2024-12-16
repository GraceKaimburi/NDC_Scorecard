/**
 *
 * @param {Record<string,any>} answers
 * @param {number} sector
 * @param {string} category
 * @param {Array} sectorQuestions
 * @returns
 */

export const calculateSectorScore = (answers, sector, category, questions) => {
  const sectorQuestions = questions.filter(
    (q) =>
      q.sector.toLowerCase() === sector.toLowerCase() &&
      q.category.toLowerCase() === category.toLowerCase()
  );

  if (!sectorQuestions.length) return "Poor";

  let totalWeight = 0;
  let weightedSum = 0;
  let answeredQuestions = 0;

  sectorQuestions.forEach((question) => {
    const answer = answers[question.id]?.answer;
    if (answer) {
      console.log({ answer });
      
      const choice = question.choices.find(
        (c) => c.description.toLowerCase() === (answer+'').toLowerCase()
      );
      if (choice) {
        const maxWeight = Math.max(...question.choices.map((c) => c.value));
        totalWeight += maxWeight;
        weightedSum += choice.value;
        answeredQuestions++;
      }
    }
  });

  if (answeredQuestions === 0) return "Poor";
  const normalizedScore = (weightedSum / totalWeight) * 100;

  if (normalizedScore >= 70) return "Good";
  if (normalizedScore >= 40) return "Average";
  return "Poor";
};
