import { memo } from "react";

const LOG_COLORS = { normal: '#8899aa', money: '#44ffaa', event: '#ff9944', chaos: '#ff4488', dice: '#44aaff', move: '#aaffaa', buy: '#ffdd44' };

const CenterPanel = memo(function CenterPanel({
  cellSize,
  players,
  currentIdx,
  doubleRentTurns,
  jackpot,
  dice,
  animDice,
  chaosDie,
  phase,
  turnTimer,
  btnStyle,
  doRoll,
  t,
  addLog,
  setPlayers,
  doEndTurn,
  pendingBuy,
  squares,
  buyProperty,
  skipBuy,
  pendingRent,
  payRent,
  activeCard,
  applyCardEffect,
  propOwners,
  setPropOwners,
  setActiveCard,
  setPendingGhostSteal,
  setPhase,
  buildOptions,
  buildHouse,
  log,
}) {
  const p = players[currentIdx];
  if (!p) return null;

  return (
    <div style={{ position: 'absolute', left: cellSize + 1, top: cellSize + 1, width: 9 * cellSize - 2, height: 9 * cellSize - 2, background: '#060e18', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 8, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 2 }}>
        <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg, #ff4488, #44aaff, #44ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 3, textShadow: 'none' }}>RAULOPOLY</div>
        {doubleRentTurns > 0 && <div style={{ fontSize: 9, color: '#ff4444', fontFamily: 'monospace' }}>🔥 ALQUILERES x2 ({doubleRentTurns} turnos)</div>}
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        {players.map((pl, i) => (
          <div key={pl.id} style={{ background: i === currentIdx ? `${pl.color}22` : '#0a1520', border: `1px solid ${i === currentIdx ? pl.color : '#1a2a3a'}`, borderRadius: 6, padding: '3px 6px', textAlign: 'center', minWidth: 58, boxShadow: i === currentIdx ? `0 0 8px ${pl.glow}` : 'none', opacity: pl.alive ? 1 : 0.5 }}>
            <div style={{ fontSize: 13 }}>{pl.isGhost ? '👻' : pl.emoji}</div>
            <div style={{ fontSize: 8, color: pl.color, fontFamily: '"Orbitron", sans-serif' }}>{pl.name.slice(0, 8)}</div>
            <div style={{ fontSize: 10, color: '#44ffaa', fontFamily: 'monospace' }}>${pl.money}</div>
            {pl.freeJailCards > 0 && <div style={{ fontSize: 7, color: '#ffdd44' }}>🗝️x{pl.freeJailCards}</div>}
            {pl.nextTurnFree && <div style={{ fontSize: 7, color: '#44ffaa' }}>🛡️</div>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: '#ffdd44', fontFamily: 'monospace' }}>🎰 Jackpot Galáctico: <strong>${jackpot}</strong></div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[dice[0], dice[1]].map((d, i) => <div key={i} style={{ width: 32, height: 32, background: '#0a2030', border: '2px solid #44aaff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: animDice ? '0 0 15px #44aaff' : '0 0 4px #44aaff44', transition: 'all 0.2s', transform: animDice ? 'rotate(20deg) scale(1.2)' : 'rotate(0deg) scale(1)' }}>{['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][d]}</div>)}
        {chaosDie !== null && <div style={{ width: 32, height: 32, background: '#2a0a20', border: '2px solid #ff4488', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 12px #ff4488' }}>{['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][chaosDie]}</div>}
        {chaosDie !== null && <div style={{ fontSize: 8, color: '#ff4488' }}>¡Dado<br />del Caos!</div>}
      </div>

      <div style={{ textAlign: 'center', width: '100%' }}>
        {phase === 'roll' && !p.isGhost && <div><div style={{ fontSize: 10, color: p.color, marginBottom: 4, fontFamily: '"Orbitron", sans-serif' }}>Turno de {p.emoji} {p.name}</div><div style={{ width: '100%', marginBottom: 6, background: '#000', border: '1px solid #444', borderRadius: 2, height: 8, overflow: 'hidden' }}><div style={{ width: `${(turnTimer / 60) * 100}%`, height: '100%', background: turnTimer > 20 ? '#44ff88' : turnTimer > 10 ? '#ffaa00' : '#ff4444', transition: 'width 0.3s, background 0.3s' }}></div></div><div style={{ fontSize: 8, color: '#8899aa', marginBottom: 6 }}>{t('turnTime')} {turnTimer}s</div><button onClick={doRoll} style={btnStyle('#44aaff')}>🎲 {t('rollDice')}</button></div>}
        {phase === 'roll' && p.isGhost && <div><div style={{ fontSize: 10, color: '#ff8888' }}>👻 {p.name} es un FANTASMA. Elige a quién molestar:</div><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>{players.filter((_, i) => i !== currentIdx && players[i].alive).map(pl => <button key={pl.id} style={btnStyle(pl.color, true)} onClick={() => { addLog(`👻 ${p.name} PERSIGUE a ${pl.name}! Pierde $150 extra en su próximo turno.`, 'chaos'); setPlayers(prev => prev.map((x, i) => i === pl.id ? { ...x, money: Math.max(0, x.money - 150) } : x)); doEndTurn(); }}>{pl.emoji} {pl.name}</button>)}<button style={btnStyle('#666', true)} onClick={doEndTurn}>Pasar</button></div></div>}
        {phase === 'buydecision' && pendingBuy && <div><div style={{ fontSize: 10, color: '#ffdd44', marginBottom: 4 }}>¿Comprar <strong>{squares[pendingBuy.squareId].name}</strong> por ${pendingBuy.price}?</div><div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}><button onClick={() => buyProperty(pendingBuy.squareId)} style={btnStyle('#44ffaa')}>💰 COMPRAR</button><button onClick={skipBuy} style={btnStyle('#ff4444')}>❌ Pasar</button></div></div>}
        {phase === 'payrent' && pendingRent && <div><div style={{ fontSize: 10, color: '#ff8888', marginBottom: 4 }}>Debes pagar <strong>${pendingRent.rent}</strong> a {players[pendingRent.ownerIdx]?.name}.{players[currentIdx].freeJailCards > 0 && ' (Tienes escudo de cárcel, no sirve aquí 😅)'}</div><button onClick={payRent} style={btnStyle('#ff4488')}>💸 PAGAR ALQUILER</button></div>}
        {phase === 'card' && activeCard && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 16 }}>{activeCard.emoji}</div><div style={{ fontSize: 10, color: activeCard.source === 'chest' ? '#ff4488' : '#44aaff', fontFamily: '"Orbitron", sans-serif' }}>{activeCard.title || 'PODER DEL CAOS'}</div><div style={{ fontSize: 9, color: '#ccc', margin: '2px 0', lineHeight: 1.3 }}>{activeCard.text || activeCard.emoji}</div><button onClick={() => applyCardEffect(activeCard, currentIdx)} style={btnStyle('#ff9944')}>⚡ EJECUTAR EFECTO</button></div>}
        {phase === 'ghoststeal' && <div><div style={{ fontSize: 10, color: '#ff4488' }}>👻 Elige a qué jugador ROBARLE una propiedad:</div><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>{players.filter((_, i) => i !== currentIdx && players[i].alive && Object.values(propOwners).some(o => o === i)).map(pl => <button key={pl.id} style={btnStyle(pl.color, true)} onClick={() => { const theirProps = Object.entries(propOwners).filter(([, o]) => o === pl.id); if (theirProps.length > 0) { const [stolenId] = theirProps[Math.floor(Math.random() * theirProps.length)]; setPropOwners(prev => ({ ...prev, [stolenId]: currentIdx })); addLog(`🫀 ${players[currentIdx].name} ROBA ${squares[stolenId].name} de ${pl.name}!`, 'chaos'); } setActiveCard(null); setPendingGhostSteal(null); setPhase('endturn'); }}>{pl.emoji} {pl.name}</button>)}</div></div>}
        {phase === 'build' && <div style={{ textAlign: 'center' }}><div style={{ fontSize: 9, color: '#aaffaa', marginBottom: 3 }}>🏗️ ¿Construir en alguna propiedad? (Si tienes monopolio)</div><div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxHeight: 40, overflowY: 'auto' }}>{buildOptions.map(({ id, color, label }) => <button key={id} style={{ ...btnStyle(color, true), fontSize: 8, padding: '2px 6px' }} onClick={() => buildHouse(Number(id))}>🏠 {label}</button>)}</div><button onClick={doEndTurn} style={btnStyle('#666')}>➡️ Fin del Turno</button></div>}
        {phase === 'endturn' && <button onClick={doEndTurn} style={btnStyle('#666')}>➡️ Terminar Turno</button>}
      </div>

      <div style={{ width: '100%', height: 55, overflowY: 'auto', background: '#050d15', borderRadius: 4, padding: '2px 4px', boxSizing: 'border-box' }}>
        {log.slice(0, 8).map((entry, i) => <div key={entry.id} style={{ fontSize: 8, color: LOG_COLORS[entry.type] || '#8899aa', lineHeight: 1.3, opacity: 1 - i * 0.08 }}>{entry.msg}</div>)}
      </div>
    </div>
  );
});

export default CenterPanel;
