import { memo, useMemo } from "react";

const CELL_BASE_STYLE = {
  position: 'absolute',
  border: '1px solid #1a2a3a',
  boxSizing: 'border-box',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'default',
};

const TOKEN_CONTAINER_STYLE = {
  position: 'absolute',
  bottom: 2,
  left: 2,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1,
};

function getGridPos(id) {
  if (id === 0) return { r: 10, c: 10 };
  if (id === 10) return { r: 10, c: 0 };
  if (id === 20) return { r: 0, c: 0 };
  if (id === 30) return { r: 0, c: 10 };
  if (id > 0 && id < 10) return { r: 10, c: 10 - id };
  if (id > 10 && id < 20) return { r: 20 - id, c: 0 };
  if (id > 20 && id < 30) return { r: 0, c: id - 20 };
  if (id > 30 && id < 40) return { r: id - 30, c: 10 };
  return { r: 0, c: 0 };
}

function getSquareRotation(id) {
  if (id === 0 || id === 10 || id === 20 || id === 30) return 0;
  if (id > 0 && id < 10) return 0;
  if (id > 10 && id < 20) return 90;
  if (id > 20 && id < 30) return 180;
  if (id > 30 && id < 40) return -90;
  return 0;
}

const SquareCell = memo(function SquareCell({ sq, cellSize, owner, houses, occupants, groupColors, playerConfigs }) {
  const { r, c } = getGridPos(sq.id);
  const rotation = getSquareRotation(sq.id);
  const isCorner = [0, 10, 20, 30].includes(sq.id);
  const ownerColor = owner !== undefined ? playerConfigs[owner].color : null;
  const groupColor = sq.group ? groupColors[sq.group] : null;

  return (
    <div
      style={{
        ...CELL_BASE_STYLE,
        left: c * cellSize,
        top: r * cellSize,
        width: cellSize,
        height: cellSize,
        background: ownerColor ? `${ownerColor}22` : '#0a1520',
      }}
    >
      {groupColor && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: groupColor, boxShadow: `0 0 6px ${groupColor}` }} />
      )}
      {ownerColor && (
        <div style={{ position: 'absolute', bottom: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: ownerColor, boxShadow: `0 0 5px ${ownerColor}` }} />
      )}
      {houses > 0 && <div style={{ position: 'absolute', top: 9, left: 2, fontSize: 8, color: '#0f0' }}>{houses === 5 ? '🏰' : '🏠'.repeat(houses)}</div>}
      <div style={{ transform: `rotate(${rotation}deg)`, textAlign: 'center', padding: '0 2px', marginTop: groupColor ? 6 : 0, width: '100%' }}>
        {isCorner ? <div style={{ fontSize: 18 }}>{sq.icon || sq.name.slice(0, 2)}</div> : <>
          <div style={{ fontSize: 6, color: '#8899aa', lineHeight: 1.1, wordBreak: 'break-word' }}>{sq.name}</div>
          {sq.price > 0 && <div style={{ fontSize: 7, color: '#44ccff', marginTop: 1 }}>${sq.price}</div>}
        </>}
      </div>
      {occupants.length > 0 && (
        <div style={TOKEN_CONTAINER_STYLE}>
          {occupants.map((p) => (
            <div key={p.key} style={p.type === 'ghost' ? { fontSize: 8, opacity: 0.6 } : {
              width: 10, height: 10, borderRadius: '50%', background: p.color, boxShadow: `0 0 4px ${p.glow}`, fontSize: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {p.type === 'ghost' ? '👻' : p.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const Board = memo(function Board({
  boardSize,
  cellSize,
  squares,
  players,
  propOwners,
  propHouses,
  groupColors,
  playerConfigs,
  centerPanel,
}) {
  const occupantsBySquare = useMemo(() => {
    const map = {};
    players.forEach((p) => {
      if (!p.alive && !p.isGhost) return;
      const id = p.position;
      if (!map[id]) map[id] = [];
      map[id].push(p.isGhost
        ? { key: `g${p.id}`, type: 'ghost' }
        : { key: p.id, type: 'player', color: p.color, glow: p.glow, emoji: p.emoji });
    });
    return map;
  }, [players]);

  return (
    <div style={{ position: 'relative', width: boardSize, height: boardSize, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: -2, border: '2px solid #44aaff', boxShadow: '0 0 20px #44aaff44, inset 0 0 20px #44aaff11', borderRadius: 4, pointerEvents: 'none' }} />
      {squares.map((sq) => (
        <SquareCell
          key={sq.id}
          sq={sq}
          cellSize={cellSize}
          owner={propOwners[sq.id]}
          houses={propHouses[sq.id] || 0}
          occupants={occupantsBySquare[sq.id] || []}
          groupColors={groupColors}
          playerConfigs={playerConfigs}
        />
      ))}
      {centerPanel}
    </div>
  );
});

export default Board;
