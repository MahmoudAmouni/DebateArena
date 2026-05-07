export type MatchOutcome = 'win' | 'loss' | 'tie';

/**
 * Calculates a player's new ELO rating after a match using the standard ELO formula.
 * 
 * @param playerRating Current rating of the player
 * @param opponentRating Current rating of the opponent
 * @param outcome Match result from the player's perspective
 * @param playerTotalDebates Used to scale the K-factor (volatility)
 * @returns The new rounded ELO rating
 */
export function calculateNewElo(
  playerRating: number,
  opponentRating: number,
  outcome: MatchOutcome,
  playerTotalDebates: number
): number {
  // Determine K-factor based on experience
  let kFactor = 32;
  if (playerTotalDebates >= 30) {
    kFactor = 16;
  } else if (playerTotalDebates >= 10) {
    kFactor = 24;
  }

  // Calculate expected score (probability of winning)
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  // Determine actual score based on outcome
  let actualScore = 0;
  if (outcome === 'win') {
    actualScore = 1;
  } else if (outcome === 'tie') {
    actualScore = 0.5;
  }

  // Calculate new rating
  const newRating = playerRating + kFactor * (actualScore - expectedScore);

  return Math.round(newRating);
}
