import { describe, expect, it } from 'vitest';
import { applyCardEffect, drawDeterministicCard } from '../rules';

const chaosCards = [
  { id: 'gain100', type: 'money', amount: 100 },
  { id: 'goToJail', type: 'move', position: 10 },
];

const chestCards = [
  { id: 'tax', type: 'money', amount: -200 },
  { id: 'goToGo', type: 'move', position: 0 },
];

describe('cartas chaos/chest deterministas', () => {
  it('selecciona siempre la carta esperada usando RNG mockeado', () => {
    const rng = () => 0.75;
    const chaosDraw = drawDeterministicCard(chaosCards, rng);
    const chestDraw = drawDeterministicCard(chestCards, rng);

    expect(chaosDraw.card.id).toBe('goToJail');
    expect(chestDraw.card.id).toBe('goToGo');
  });

  it('aplica efectos de carta de dinero y movimiento', () => {
    const player = { id: 0, money: 500, position: 5 };

    const afterMoney = applyCardEffect({ player, card: chaosCards[0] });
    const afterMove = applyCardEffect({ player, card: chaosCards[1] });

    expect(afterMoney.money).toBe(600);
    expect(afterMove.position).toBe(10);
  });
});
