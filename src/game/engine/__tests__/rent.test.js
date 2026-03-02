import { describe, expect, it } from 'vitest';
import { calculateRent } from '../rules';

const squares = {
  1: { id: 1, type: 'property', group: 'brown', rent: [2, 10, 30] },
  3: { id: 3, type: 'property', group: 'brown', rent: [4, 20, 60] },
  5: { id: 5, type: 'railroad' },
  15: { id: 15, type: 'railroad' },
  12: { id: 12, type: 'utility' },
  28: { id: 28, type: 'utility' },
};

const groupSquares = { brown: [1, 3] };
const railroads = [5, 15];
const utilities = [12, 28];

describe('calculateRent', () => {
  it('calcula renta base y monopolio para propiedad', () => {
    const baseRent = calculateRent({
      squareId: 1,
      diceTotal: 8,
      squares,
      owners: { 1: 0 },
      houses: {},
      groupSquares,
      railroads,
      utilities,
    });

    const monopolyRent = calculateRent({
      squareId: 1,
      diceTotal: 8,
      squares,
      owners: { 1: 0, 3: 0 },
      houses: {},
      groupSquares,
      railroads,
      utilities,
    });

    expect(baseRent).toBe(2);
    expect(monopolyRent).toBe(4);
  });

  it('calcula renta para estaciones según cantidad', () => {
    const rent = calculateRent({
      squareId: 5,
      diceTotal: 6,
      squares,
      owners: { 5: 1, 15: 1 },
      houses: {},
      groupSquares,
      railroads,
      utilities,
    });

    expect(rent).toBe(50);
  });

  it('calcula renta para utilities con multiplicador por dos utilities', () => {
    const rent = calculateRent({
      squareId: 12,
      diceTotal: 7,
      squares,
      owners: { 12: 2, 28: 2 },
      houses: {},
      groupSquares,
      railroads,
      utilities,
    });

    expect(rent).toBe(70);
  });
});
