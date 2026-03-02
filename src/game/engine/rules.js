import { calcRentAmount } from './rentUtils';

export function calculateRent(context) {
  return calcRentAmount(context);
}

export function resolveJailTurn({
  player,
  dice = [1, 1],
  payToLeave = false,
  jailFee = 50,
  maxTurns = 3,
}) {
  if (!player.inJail) {
    return { player, leftJail: false, consumedTurn: false, reason: 'not-in-jail' };
  }

  const [d1, d2] = dice;
  const rolledDoubles = d1 === d2;

  if (payToLeave && player.money >= jailFee) {
    return {
      player: { ...player, inJail: false, jailTurns: 0, money: player.money - jailFee },
      leftJail: true,
      consumedTurn: false,
      reason: 'paid',
    };
  }

  if (rolledDoubles) {
    return {
      player: { ...player, inJail: false, jailTurns: 0 },
      leftJail: true,
      consumedTurn: false,
      reason: 'doubles',
    };
  }

  const jailTurns = (player.jailTurns || 0) + 1;
  if (jailTurns >= maxTurns && player.money >= jailFee) {
    return {
      player: { ...player, inJail: false, jailTurns: 0, money: player.money - jailFee },
      leftJail: true,
      consumedTurn: false,
      reason: 'forced-payment',
    };
  }

  return {
    player: { ...player, jailTurns },
    leftJail: false,
    consumedTurn: true,
    reason: 'stay',
  };
}

export function drawDeterministicCard(cards, rng = Math.random) {
  if (!cards.length) return { card: null, index: -1 };
  const index = Math.min(cards.length - 1, Math.floor(rng() * cards.length));
  return { card: cards[index], index };
}

export function applyCardEffect({ player, card, boardSize = 40 }) {
  if (!card) return player;

  if (card.type === 'money') {
    return { ...player, money: player.money + card.amount };
  }

  if (card.type === 'move') {
    return { ...player, position: ((card.position % boardSize) + boardSize) % boardSize };
  }

  return player;
}

export function getNextActivePlayerIndex(players, currentIdx) {
  if (!players.length) return -1;

  for (let step = 1; step <= players.length; step += 1) {
    const idx = (currentIdx + step) % players.length;
    if (players[idx].alive !== false) return idx;
  }

  return -1;
}

export function getVictoryState(players) {
  const alivePlayers = players.filter((player) => player.alive !== false);
  return {
    hasWinner: alivePlayers.length === 1,
    winner: alivePlayers.length === 1 ? alivePlayers[0] : null,
  };
}
