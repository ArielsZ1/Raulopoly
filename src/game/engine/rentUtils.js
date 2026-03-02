export function hasMonopolyGroup(owners, groupSquares, playerIdx, group) {
  const squares = groupSquares[group] || [];
  return squares.length > 0 && squares.every((id) => owners[id] === playerIdx);
}

export function calcRentAmount({
  squareId,
  diceTotal,
  squares,
  owners,
  houses,
  groupSquares,
  railroads,
  utilities,
}) {
  const sq = squares[squareId];
  if (!sq) return 0;

  if (sq.type === 'property') {
    const houseCount = houses[squareId] || 0;
    if (houseCount > 0) return sq.rent[houseCount];
    const owner = owners[squareId];
    const ownsGroup = (groupSquares[sq.group] || []).every((id) => owners[id] === owner);
    return ownsGroup ? sq.rent[0] * 2 : sq.rent[0];
  }

  if (sq.type === 'railroad') {
    const owner = owners[squareId];
    const ownedCount = railroads.filter((id) => owners[id] === owner).length;
    return ownedCount > 0 ? 25 * (2 ** (ownedCount - 1)) : 0;
  }

  if (sq.type === 'utility') {
    const owner = owners[squareId];
    const ownedCount = utilities.filter((id) => owners[id] === owner).length;
    return diceTotal * (ownedCount === 2 ? 10 : 4);
  }

  return 0;
}
