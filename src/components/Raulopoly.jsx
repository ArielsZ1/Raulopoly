import {
  CHAOS_CARDS,
  GROUP_COLORS,
  PLAYER_CONFIGS,
  SQUARE_DATA,
  getGridPos,
  getSquareRotation,
  useGameEngine,
} from "../hooks/useGameEngine";

export default function Raulopoly() {
  const {
    t, screen, setScreen, numPlayers, setNumPlayers, players, setPlayers, currentIdx, phase, setPhase,
    dice, chaosDie, propOwners, setPropOwners, propHouses, log, jackpot, activeCard, setActiveCard,
    pendingBuy, pendingRent, winner, animDice, pendingGhostSteal, setPendingGhostSteal,
    playerNames, setPlayerNames, initialMoney, setInitialMoney, rentMultiplier, setRentMultiplier,
    chaosChance, setChaoschance, hasSavedGame, showAdvancedSettings, setShowAdvancedSettings,
    turnTimer, setTurnTimer, showHelp, setShowHelp, showTutorial, setShowTutorial,
    features, squareInfo, rulesText,
    startGame, hasMonopoly, doRoll, applyCardEffect, buyProperty, skipBuy, payRent, doEndTurn, buildHouse, loadGame, saveGame,
  } = useGameEngine();


  const CELL_SIZE = 54;
  const BOARD_SIZE = 11 * CELL_SIZE;

  function renderSquare(sq) {
    const { r, c } = getGridPos(sq.id);
    const rotation = getSquareRotation(sq.id);
    const isCorner = [0, 10, 20, 30].includes(sq.id);
    const owner = propOwners[sq.id];
    const ownerColor = owner !== undefined ? PLAYER_CONFIGS[owner].color : null;
    const houses = propHouses[sq.id] || 0;
    const groupColor = sq.group ? GROUP_COLORS[sq.group] : null;

    const playersHere = players.filter(p => p.position === sq.id && p.alive);
    const ghostsHere  = players.filter(p => p.position === sq.id && p.isGhost);

    return (
      <div
        key={sq.id}
        style={{
          position: 'absolute',
          left: c * CELL_SIZE,
          top: r * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
          border: '1px solid #1a2a3a',
          boxSizing: 'border-box',
          background: ownerColor ? `${ownerColor}22` : '#0a1520',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default',
        }}
      >
        {/* Color stripe */}
        {groupColor && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 8,
            background: groupColor,
            boxShadow: `0 0 6px ${groupColor}`,
          }}/>
        )}
        {/* Owner dot */}
        {ownerColor && (
          <div style={{
            position: 'absolute',
            bottom: 2, right: 2,
            width: 8, height: 8,
            borderRadius: '50%',
            background: ownerColor,
            boxShadow: `0 0 5px ${ownerColor}`,
          }}/>
        )}
        {/* Houses */}
        {houses > 0 && (
          <div style={{ position: 'absolute', top: 9, left: 2, fontSize: 8, color: '#0f0' }}>
            {houses === 5 ? '🏰' : '🏠'.repeat(houses)}
          </div>
        )}
        {/* Content */}
        <div style={{
          transform: `rotate(${rotation}deg)`,
          textAlign: 'center',
          padding: '0 2px',
          marginTop: groupColor ? 6 : 0,
          width: '100%',
        }}>
          {isCorner ? (
            <div style={{ fontSize: 18 }}>{sq.icon || sq.name.slice(0,2)}</div>
          ) : (
            <>
              <div style={{ fontSize: 6, color: '#8899aa', lineHeight: 1.1, wordBreak: 'break-word' }}>
                {sq.name}
              </div>
              {sq.price > 0 && (
                <div style={{ fontSize: 7, color: '#44ccff', marginTop: 1 }}>${sq.price}</div>
              )}
            </>
          )}
        </div>
        {/* Player tokens */}
        {playersHere.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 2, left: 2,
            display: 'flex', flexWrap: 'wrap', gap: 1,
          }}>
            {playersHere.map(p => (
              <div key={p.id} style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 4px ${p.glow}`,
                fontSize: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p.emoji}
              </div>
            ))}
            {ghostsHere.map(p => (
              <div key={`g${p.id}`} style={{ fontSize: 8, opacity: 0.6 }}>👻</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const getSquareInfo = (squareType) => {
    return squareInfo[squareType] || t('unknownSquare', { returnObjects: true });
  };

  function renderCenter() {
    const p = players[currentIdx];
    if (!p) return null;
    const logColors = { normal: '#8899aa', money: '#44ffaa', event: '#ff9944', chaos: '#ff4488', dice: '#44aaff', move: '#aaffaa', buy: '#ffdd44' };

    return (
      <div style={{
        position: 'absolute',
        left: CELL_SIZE + 1,
        top: CELL_SIZE + 1,
        width: 9 * CELL_SIZE - 2,
        height: 9 * CELL_SIZE - 2,
        background: '#060e18',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 2 }}>
          <div style={{
            fontFamily: '"Orbitron", sans-serif',
            fontSize: 22,
            fontWeight: 900,
            background: 'linear-gradient(90deg, #ff4488, #44aaff, #44ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 3,
            textShadow: 'none',
          }}>RAULOPOLY</div>
          {doubleRentTurns > 0 && (
            <div style={{ fontSize: 9, color: '#ff4444', fontFamily: 'monospace' }}>
              🔥 ALQUILERES x2 ({doubleRentTurns} turnos)
            </div>
          )}
        </div>

        {/* Players */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {players.map((pl, i) => (
            <div key={pl.id} style={{
              background: i === currentIdx ? `${pl.color}22` : '#0a1520',
              border: `1px solid ${i === currentIdx ? pl.color : '#1a2a3a'}`,
              borderRadius: 6,
              padding: '3px 6px',
              textAlign: 'center',
              minWidth: 58,
              boxShadow: i === currentIdx ? `0 0 8px ${pl.glow}` : 'none',
              opacity: pl.alive ? 1 : 0.5,
            }}>
              <div style={{ fontSize: 13 }}>{pl.isGhost ? '👻' : pl.emoji}</div>
              <div style={{ fontSize: 8, color: pl.color, fontFamily: '"Orbitron", sans-serif' }}>
                {pl.name.slice(0, 8)}
              </div>
              <div style={{ fontSize: 10, color: '#44ffaa', fontFamily: 'monospace' }}>
                ${pl.money}
              </div>
              {pl.freeJailCards > 0 && <div style={{ fontSize: 7, color: '#ffdd44' }}>🗝️x{pl.freeJailCards}</div>}
              {pl.nextTurnFree && <div style={{ fontSize: 7, color: '#44ffaa' }}>🛡️</div>}
            </div>
          ))}
        </div>

        {/* Jackpot */}
        <div style={{ fontSize: 11, color: '#ffdd44', fontFamily: 'monospace' }}>
          🎰 Jackpot Galáctico: <strong>${jackpot}</strong>
        </div>

        {/* Dice */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[dice[0], dice[1]].map((d, i) => (
            <div key={i} style={{
              width: 32, height: 32,
              background: '#0a2030',
              border: '2px solid #44aaff',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              boxShadow: animDice ? '0 0 15px #44aaff' : '0 0 4px #44aaff44',
              transition: 'all 0.2s',
              transform: animDice ? 'rotate(20deg) scale(1.2)' : 'rotate(0deg) scale(1)',
            }}>
              {['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][d]}
            </div>
          ))}
          {chaosDie !== null && (
            <div style={{
              width: 32, height: 32,
              background: '#2a0a20',
              border: '2px solid #ff4488',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 0 12px #ff4488',
            }}>
              {['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][chaosDie]}
            </div>
          )}
          {chaosDie !== null && (
            <div style={{ fontSize: 8, color: '#ff4488' }}>¡Dado<br/>del Caos!</div>
          )}
        </div>

        {/* ACTION AREA */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          {phase === 'roll' && !p.isGhost && (
            <div>
              <div style={{ fontSize: 10, color: p.color, marginBottom: 4, fontFamily: '"Orbitron", sans-serif' }}>
                Turno de {p.emoji} {p.name}
              </div>
              {/* Timer bar */}
              <div style={{ width: '100%', marginBottom: 6, background: '#000', border: '1px solid #444', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${(turnTimer/60)*100}%`,
                  height: '100%',
                  background: turnTimer > 20 ? '#44ff88' : turnTimer > 10 ? '#ffaa00' : '#ff4444',
                  transition: 'width 0.3s, background 0.3s',
                }}></div>
              </div>
              <div style={{ fontSize: 8, color: '#8899aa', marginBottom: 6 }}>{t('turnTime')} {turnTimer}s</div>
              <button onClick={doRoll} style={btnStyle('#44aaff')}>
                🎲 {t('rollDice')}
              </button>
            </div>
          )}
          {phase === 'roll' && p.isGhost && (
            <div>
              <div style={{ fontSize: 10, color: '#ff8888' }}>👻 {p.name} es un FANTASMA. Elige a quién molestar:</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                {players.filter((_, i) => i !== currentIdx && players[i].alive).map(pl => (
                  <button key={pl.id} style={btnStyle(pl.color, true)} onClick={() => {
                    addLog(`👻 ${p.name} PERSIGUE a ${pl.name}! Pierde $150 extra en su próximo turno.`, 'chaos');
                    setPlayers(prev => prev.map((x, i) => i === pl.id ? { ...x, money: Math.max(0, x.money - 150) } : x));
                    doEndTurn();
                  }}>
                    {pl.emoji} {pl.name}
                  </button>
                ))}
                <button style={btnStyle('#666', true)} onClick={doEndTurn}>Pasar</button>
              </div>
            </div>
          )}
          {phase === 'buydecision' && pendingBuy && (
            <div>
              <div style={{ fontSize: 10, color: '#ffdd44', marginBottom: 4 }}>
                ¿Comprar <strong>{SQUARE_DATA[pendingBuy.squareId].name}</strong> por ${pendingBuy.price}?
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                <button onClick={() => buyProperty(pendingBuy.squareId)} style={btnStyle('#44ffaa')}>💰 COMPRAR</button>
                <button onClick={skipBuy} style={btnStyle('#ff4444')}>❌ Pasar</button>
              </div>
            </div>
          )}
          {phase === 'payrent' && pendingRent && (
            <div>
              <div style={{ fontSize: 10, color: '#ff8888', marginBottom: 4 }}>
                Debes pagar <strong>${pendingRent.rent}</strong> a {players[pendingRent.ownerIdx]?.name}.
                {players[currentIdx].freeJailCards > 0 && ' (Tienes escudo de cárcel, no sirve aquí 😅)'}
              </div>
              <button onClick={payRent} style={btnStyle('#ff4488')}>💸 PAGAR ALQUILER</button>
            </div>
          )}
          {phase === 'card' && activeCard && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16 }}>{activeCard.emoji}</div>
              <div style={{ fontSize: 10, color: activeCard.source === 'chest' ? '#ff4488' : '#44aaff', fontFamily: '"Orbitron", sans-serif' }}>
                {activeCard.title || 'PODER DEL CAOS'}
              </div>
              <div style={{ fontSize: 9, color: '#ccc', margin: '2px 0', lineHeight: 1.3 }}>
                {activeCard.text || activeCard.emoji}
              </div>
              <button onClick={() => applyCardEffect(activeCard, currentIdx)} style={btnStyle('#ff9944')}>
                ⚡ EJECUTAR EFECTO
              </button>
            </div>
          )}
          {phase === 'ghoststeal' && (
            <div>
              <div style={{ fontSize: 10, color: '#ff4488' }}>👻 Elige a qué jugador ROBARLE una propiedad:</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
                {players.filter((_, i) => i !== currentIdx && players[i].alive && Object.values(propOwners).some(o => o === i)).map(pl => (
                  <button key={pl.id} style={btnStyle(pl.color, true)} onClick={() => {
                    const theirProps = Object.entries(propOwners).filter(([, o]) => o === pl.id);
                    if (theirProps.length > 0) {
                      const [stolenId] = theirProps[Math.floor(Math.random() * theirProps.length)];
                      setPropOwners(prev => ({ ...prev, [stolenId]: currentIdx }));
                      addLog(`🫀 ${players[currentIdx].name} ROBA ${SQUARE_DATA[stolenId].name} de ${pl.name}!`, 'chaos');
                    }
                    setActiveCard(null);
                    setPendingGhostSteal(null);
                    setPhase('endturn');
                  }}>
                    {pl.emoji} {pl.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {phase === 'build' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#aaffaa', marginBottom: 3 }}>
                🏗️ ¿Construir en alguna propiedad? (Si tienes monopolio)
              </div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxHeight: 40, overflowY: 'auto' }}>
                {Object.entries(propOwners)
                  .filter(([id, o]) => o === currentIdx && SQUARE_DATA[id]?.type === 'property' && hasMonopoly(currentIdx, SQUARE_DATA[id].group) && (propHouses[id] || 0) < 5)
                  .map(([id]) => (
                    <button key={id} style={{ ...btnStyle(GROUP_COLORS[SQUARE_DATA[id].group] || '#888', true), fontSize: 8, padding: '2px 6px' }}
                      onClick={() => buildHouse(Number(id))}>
                      🏠 {SQUARE_DATA[id].name.slice(0, 10)}
                    </button>
                  ))}
              </div>
              <button onClick={doEndTurn} style={btnStyle('#666')}>➡️ Fin del Turno</button>
            </div>
          )}
          {phase === 'endturn' && (
            <button onClick={doEndTurn} style={btnStyle('#666')}>➡️ Terminar Turno</button>
          )}
        </div>

        {/* Log */}
        <div style={{
          width: '100%',
          height: 55,
          overflowY: 'auto',
          background: '#050d15',
          borderRadius: 4,
          padding: '2px 4px',
          boxSizing: 'border-box',
        }}>
          {log.slice(0, 8).map((entry, i) => (
            <div key={entry.id} style={{
              fontSize: 8,
              color: logColors[entry.type] || '#8899aa',
              lineHeight: 1.3,
              opacity: 1 - i * 0.08,
            }}>
              {entry.msg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const btnStyle = (color, small = false) => ({
    background: `${color}22`,
    border: `1px solid ${color}`,
    color: color,
    borderRadius: 4,
    padding: small ? '3px 8px' : '4px 12px',
    fontSize: small ? 9 : 11,
    cursor: 'pointer',
    fontFamily: '"Orbitron", sans-serif',
    boxShadow: `0 0 8px ${color}44`,
    transition: 'all 0.15s',
    margin: 2,
  });

  // ========================= SCREENS =========================

  // Tutorial Screen
  if (showTutorial) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        color: '#fff',
        padding: 20,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{
          background: 'linear-gradient(135deg, #0a1525 0%, #1a0525 100%)',
          border: '2px solid #44aaff',
          borderRadius: 12,
          padding: 40,
          maxWidth: 700,
          textAlign: 'center',
          boxShadow: '0 0 40px #44aaff44, inset 0 0 20px #44aaff11',
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 20 }}>🔍</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#44aaff', marginBottom: 12, letterSpacing: 2 }}>
            {t('tutorialIntro')}
          </div>
          <div style={{ fontSize: 14, color: '#8899aa', marginBottom: 30, lineHeight: 1.6 }}>
            {t('tutorialDesc')}
          </div>
          
          {/* Features List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                background: '#0a1520',
                border: '1px solid #1a2a3a',
                borderRadius: 8,
                padding: 12,
                fontSize: 11,
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{feature.title.split(' ')[0]}</div>
                <div style={{ color: '#ccc', fontWeight: 'bold', marginBottom: 4 }}>
                  {feature.title.split(' ').slice(1).join(' ')}
                </div>
                <div style={{ color: '#668899', fontSize: 10 }}>{feature.desc}</div>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => {
              localStorage.setItem('raulopolyTutorialSeen', 'true');
              setShowTutorial(false);
              setScreen('rules');
            }} style={{ ...btnStyle('#44ff88'), fontSize: 14, padding: '10px 30px', width: 'auto' }}>
              {t('startGame')}
            </button>
            <button onClick={() => {
              localStorage.setItem('raulopolyTutorialSeen', 'true');
              setShowTutorial(false);
            }} style={{ ...btnStyle('#666'), fontSize: 12, padding: '8px 20px', width: 'auto' }}>
              {t('skipTutorial')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'winner') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020812',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80 }}>{winner?.emoji}</div>
          <div style={{
            fontSize: 40, fontWeight: 900,
            background: `linear-gradient(90deg, ${winner?.color}, #fff)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginTop: 10,
          }}>¡{winner?.name} GANA!</div>
          <div style={{ color: '#aaa', marginTop: 10, fontSize: 14 }}>
            Con ${winner?.money} en el banco galáctico
          </div>
          <button onClick={() => setScreen('menu')} style={{ ...btnStyle('#44aaff'), marginTop: 30, fontSize: 14 }}>
            🚀 Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        flexDirection: 'column',
        gap: 30,
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 10 }}>
          <button onClick={() => setLanguage('es')} style={{ ...btnStyle(language === 'es' ? '#44ff88' : '#334455'), fontSize: 12 }}>ES</button>
          <button onClick={() => setLanguage('en')} style={{ ...btnStyle(language === 'en' ? '#44ff88' : '#334455'), fontSize: 12 }}>EN</button>
        </div>
        <div style={{
          fontSize: 56, fontWeight: 900,
          background: 'linear-gradient(135deg, #ff4488, #44aaff, #44ff88, #ffdd44)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: 8,
          textShadow: 'none',
          animation: 'pulse 2s infinite',
        }}>
          {t('title')}
        </div>
        <div style={{ color: '#8899aa', fontSize: 13, letterSpacing: 3 }}>
          {t('subtitle')}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 600, fontSize: 11, color: '#667788' }}>
          {features.map(feature => (
            <div key={feature.title} style={{ background: '#0a1520', border: '1px solid #1a2a3a', borderRadius: 8, padding: '8px 12px', width: 160, textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>{feature.title}</div>
              <div style={{ fontSize: 9, marginTop: 3, color: '#556677' }}>{feature.desc}</div>
            </div>
          ))}
        </div>
        {hasSavedGame && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={loadGame} style={{ ...btnStyle('#44ff88'), fontSize: 14, padding: '8px 20px' }}>
              ⏳ REANUDAR ÚTIMA PARTIDA
            </button>
            <button onClick={() => { localStorage.removeItem('raulopolyGame'); setHasSavedGame(false); }} style={{ ...btnStyle('#aa4444'), fontSize: 12, padding: '6px 12px' }}>
              {t('delete')}
            </button>
          </div>
        )}
        <button onClick={() => setScreen('rules')} style={{ ...btnStyle('#44aaff'), fontSize: 16, padding: '10px 30px' }}>
          🚀 {t('play')}
        </button>
        <button onClick={() => setShowTutorial(true)} style={{ ...btnStyle('#ffaa00'), fontSize: 12, padding: '8px 20px' }}>
          {t('tutorial')}
        </button>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.8} }`}</style>
      </div>
    );
  }

  if (screen === 'rules') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        flexDirection: 'column',
        gap: 20,
        color: '#fff'
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ fontSize: 36, fontWeight: 900 }}>{t('rules')}</div>
        <div style={{ maxWidth: 600, textAlign: 'left', fontSize: 14 }}>
          <ul style={{ paddingLeft: 20 }}>
            {rulesText.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setScreen('setup')} style={{ ...btnStyle('#44aaff'), fontSize: 14, padding: '8px 24px' }}>
            {t('understood')}
          </button>
          <button onClick={() => setScreen('menu')} style={{ ...btnStyle('#aa4444'), fontSize: 14, padding: '8px 24px' }}>
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'setup') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0a1525 0%, #020812 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Orbitron", sans-serif',
        flexDirection: 'column',
        gap: 20,
        color: '#fff',
        overflowY: 'auto',
        padding: '20px',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#44aaff', letterSpacing: 4 }}>{t('config')}</div>
        <div style={{ fontSize: 12, color: '#8899aa' }}>{t('customize')}</div>
        
        {/* Selección de jugadores */}
        <div style={{ width: 400, background: '#0a1520', border: '1px solid #1a2a3a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 8 }}>{t('players')}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[2, 3, 4].map(n => (
              <button key={n} onClick={() => setNumPlayers(n)} style={{
                ...btnStyle(numPlayers === n ? '#44aaff' : '#334455'),
                fontSize: 14, padding: '6px 16px',
              }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        
        {/* Nombres de jugadores */}
        <div style={{ width: 400, background: '#0a1520', border: '1px solid #1a2a3a', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 8 }}>{t('names')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Array.from({ length: numPlayers }, (_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>{PLAYER_CONFIGS[i].emoji}</span>
                <input
                  value={playerNames[i]}
                  onChange={e => setPlayerNames(prev => prev.map((n, j) => j === i ? e.target.value : n))}
                  style={{
                    flex: 1,
                    background: '#0a1520',
                    border: `1px solid ${PLAYER_CONFIGS[i].color}`,
                    borderRadius: 4,
                    color: PLAYER_CONFIGS[i].color,
                    padding: '4px 8px',
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 10,
                    outline: 'none',
                  }}
                  placeholder={`Jugador ${i+1}`}
                  maxLength={12}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Botón para mostrar/ocultar configuración avanzada */}
        <button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} style={{ ...btnStyle('#ffaa00'), fontSize: 12, padding: '6px 16px' }}>
          {showAdvancedSettings ? '⌄' : '⌃'} {t('advancedSettings')}
        </button>
        
        {/* Configuración avanzada */}
        {showAdvancedSettings && (
          <div style={{ width: 400, background: '#0a1520', border: '1px solid #aa6600', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, color: '#ff9966', marginBottom: 12, fontWeight: 'bold' }}>Reglas personalizadas:</div>
            
            {/* Dinero inicial */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{t('initialMoney')}: ${initialMoney}</div>
              <input 
                type="range" 
                min="500" 
                max="3000" 
                step="100" 
                value={initialMoney}
                onChange={e => setInitialMoney(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Multiplicador de alquiler */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{t('rentMultiplier')}: x{rentMultiplier.toFixed(1)}</div>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={rentMultiplier}
                onChange={e => setRentMultiplier(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Probabilidad de Caos */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{t('chaosChance')}: {(chaosChance*100).toFixed(0)}%</div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05" 
                value={chaosChance}
                onChange={e => setChaoschance(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={startGame} style={{ ...btnStyle('#44ff88'), fontSize: 14, padding: '8px 24px' }}>
            🚀 {t('start')}
          </button>
          <button onClick={() => setScreen('rules')} style={{ ...btnStyle('#aa4444'), fontSize: 14, padding: '8px 24px' }}>
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  // ========================= GAME SCREEN =========================

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020812',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      boxSizing: 'border-box',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet"/>
      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: '#00000088',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowHelp(false)}>
          <div style={{
            background: '#0a1525',
            border: '2px solid #44aaff',
            borderRadius: 8,
            padding: 20,
            maxWidth: 400,
            maxHeight: '80vh',
            overflowY: 'auto',
            fontFamily: '"Orbitron", sans-serif',
            color: '#fff',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, color: '#44aaff' }}>{t('helpTitle')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 11 }}>
              {Object.entries(squareInfo).map(([key, info]) => (
                <div key={key} style={{ background: '#0a2030', border: '1px solid #1a3a4a', borderRadius: 4, padding: 8 }}>
                  <div style={{ color: '#44ff88', fontWeight: 700, marginBottom: 4 }}>{info.name}</div>
                  <div style={{ color: '#8899aa', fontSize: 9, lineHeight: 1.3 }}>{info.desc}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHelp(false)} style={{ ...btnStyle('#44aaff'), marginTop: 12, width: '100%' }}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
      {/* Top-right controls */}
      <div style={{ position: 'fixed', top: 10, right: 10, display: 'flex', gap: 8, zIndex: 100 }}>
        <button onClick={() => setShowHelp(!showHelp)} style={{ ...btnStyle('#ffaa00'), fontSize: 14 }}>
          {t('help')}
        </button>
        <button onClick={() => setLanguage('es')} style={{ ...btnStyle(language === 'es' ? '#44ff88' : '#334455'), fontSize: 11 }}>ES</button>
        <button onClick={() => setLanguage('en')} style={{ ...btnStyle(language === 'en' ? '#44ff88' : '#334455'), fontSize: 11 }}>EN</button>
      </div>
      <div style={{ position: 'relative', width: BOARD_SIZE, height: BOARD_SIZE, flexShrink: 0 }}>
        {/* Board border glow */}
        <div style={{
          position: 'absolute',
          inset: -2,
          border: '2px solid #44aaff',
          boxShadow: '0 0 20px #44aaff44, inset 0 0 20px #44aaff11',
          borderRadius: 4,
          pointerEvents: 'none',
        }}/>
        {/* Squares */}
        {SQUARE_DATA.map(sq => renderSquare(sq))}
        {/* Center panel */}
        {renderCenter()}
      </div>

      {/* Right panel - property list */}
      <div style={{
        marginLeft: 12,
        width: 200,
        height: BOARD_SIZE,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 10, color: '#44aaff', marginBottom: 4 }}>
          {t('propertyMap')}
        </div>
        {Object.entries(GROUP_SQUARES).map(([group, ids]) => (
          <div key={group} style={{
            background: '#0a1520',
            border: `1px solid ${GROUP_COLORS[group]}44`,
            borderLeft: `3px solid ${GROUP_COLORS[group]}`,
            borderRadius: 4,
            padding: '4px 6px',
          }}>
            <div style={{ fontSize: 8, color: GROUP_COLORS[group], fontFamily: '"Orbitron", sans-serif', marginBottom: 2 }}>
              {group.toUpperCase()}
            </div>
            {ids.map(id => {
              const owner = propOwners[id];
              const houses = propHouses[id] || 0;
              const sq = SQUARE_DATA[id];
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 1 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: owner !== undefined ? PLAYER_CONFIGS[owner].color : '#333',
                  }}/>
                  <div style={{ fontSize: 7, color: owner !== undefined ? '#ccc' : '#445566', flex: 1 }}>
                    {sq.name}
                  </div>
                  {houses > 0 && (
                    <div style={{ fontSize: 7, color: '#44ff88' }}>
                      {houses === 5 ? '🏰' : `🏠${houses}`}
                    </div>
                  )}
                  {owner !== undefined && (
                    <div style={{ fontSize: 9 }}>{PLAYER_CONFIGS[owner].emoji}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {/* Railroads + Utilities */}
        <div style={{
          background: '#0a1520', border: '1px solid #334455', borderRadius: 4, padding: '4px 6px',
        }}>
          <div style={{ fontSize: 8, color: '#888', fontFamily: '"Orbitron", sans-serif', marginBottom: 2 }}>{t('otherProperties')}</div>
          {[...RAILROADS, ...UTILITIES].map(id => {
            const owner = propOwners[id];
            const sq = SQUARE_DATA[id];
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 1 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: owner !== undefined ? PLAYER_CONFIGS[owner].color : '#333' }}/>
                <div style={{ fontSize: 7, color: owner !== undefined ? '#ccc' : '#445566', flex: 1 }}>{sq.name}</div>
                {owner !== undefined && <div style={{ fontSize: 9 }}>{PLAYER_CONFIGS[owner].emoji}</div>}
              </div>
            );
          })}
        </div>
        <button onClick={() => { if (window.confirm(t('exitConfirmation'))) setScreen('menu'); }}
          style={{ ...btnStyle('#333', true), marginTop: 8, width: '100%' }}>
          {t('exit')}
        </button>
      </div>
    </div>
  );
}
