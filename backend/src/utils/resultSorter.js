/**
 * Sorts retrieval results by similarity score (highest first).
 * Acts as a safeguard in case the DB returns results out of order.
 * @param {Array<{ text, source, score }>} results
 * @returns {Array<{ text, source, score }>}
 */
const sortByScore = (results) => {
  return [...results].sort((a, b) => b.score - a.score);
};

export default sortByScore;