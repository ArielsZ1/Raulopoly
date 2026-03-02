import { describe, expect, it } from 'vitest';
import { resolveJailTurn } from '../rules';

const basePlayer = { id: 0, money: 300, inJail: true, jailTurns: 0 };

describe('resolveJailTurn', () => {
  it('consume turno y aumenta jailTurns cuando no paga ni saca dobles', () => {
    const result = resolveJailTurn({ player: basePlayer, dice: [1, 2] });

    expect(result.leftJail).toBe(false);
    expect(result.consumedTurn).toBe(true);
    expect(result.player.jailTurns).toBe(1);
  });

  it('sale de la cárcel pagando', () => {
    const result = resolveJailTurn({ player: basePlayer, payToLeave: true, jailFee: 50 });

    expect(result.leftJail).toBe(true);
    expect(result.reason).toBe('paid');
    expect(result.player.inJail).toBe(false);
    expect(result.player.money).toBe(250);
  });

  it('sale de la cárcel con dobles', () => {
    const result = resolveJailTurn({ player: basePlayer, dice: [6, 6] });

    expect(result.leftJail).toBe(true);
    expect(result.reason).toBe('doubles');
    expect(result.player.inJail).toBe(false);
    expect(result.player.jailTurns).toBe(0);
  });
});
