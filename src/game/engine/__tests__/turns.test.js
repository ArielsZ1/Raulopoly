import { describe, expect, it } from 'vitest';
import { getNextActivePlayerIndex, getVictoryState } from '../rules';

describe('transición de turnos y victoria', () => {
  it('avanza al siguiente jugador vivo', () => {
    const players = [
      { id: 0, alive: true },
      { id: 1, alive: false },
      { id: 2, alive: true },
    ];

    expect(getNextActivePlayerIndex(players, 0)).toBe(2);
    expect(getNextActivePlayerIndex(players, 2)).toBe(0);
  });

  it('declara victoria cuando queda un solo jugador vivo', () => {
    const players = [
      { id: 0, alive: false },
      { id: 1, alive: true, name: 'Jugador 2' },
      { id: 2, alive: false },
    ];

    const result = getVictoryState(players);
    expect(result.hasWinner).toBe(true);
    expect(result.winner?.name).toBe('Jugador 2');
  });
});
